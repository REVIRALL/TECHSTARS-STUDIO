/**
 * LP の PLANS（services/stripeConfig.ts）どおりに、Stripe の商品・価格・Payment Link をそろえる。
 * **手元でだけ走らせる**（秘密鍵が要るため。このリポジトリは public なので鍵を書かない）。
 *
 *   STRIPE_SECRET_KEY=sk_test_xxx node scripts/stripe-setup.mjs            # 何をするかを見るだけ（書かない）
 *   STRIPE_SECRET_KEY=sk_test_xxx node scripts/stripe-setup.mjs --apply    # 実際にそろえる
 *   STRIPE_SECRET_KEY=rk_live_xxx node scripts/stripe-setup.mjs --apply    # 本番（制限付きキーで足りる）
 *
 * ★正本は stripeConfig.ts の PLANS（名前・金額・税の内訳・項目）。Stripe 側を手で直さない。
 *   料金を変えたら、stripeConfig.ts を直してからこれを流す → verify:stripe で突き合わせる。
 * ★何度流しても同じ（冪等）。plan_code の metadata で既存の物を探し、足りない物だけ作る。
 *   - 商品：plan_code で1つ。名前・説明が違えば直す（商品は消せないので作り直さない）。
 *   - 価格：金額が違えば新しい価格を作り、既定の価格を付け替えて古い価格は止める（価格は金額を変えられない）。
 *   - Payment Link：今の価格・今の設定で有効な物が無ければ作る。古いリンクは止める
 *     （止めたリンクを開いた人には inactive_message を出す）。
 * ★JPY は 0 桁通貨。unit_amount=437800 がそのまま 437,800 円（×100 しない）。
 * ★出力の最後に、Netlify に入れる VITE_PAY_LINK_* の3行を出す（URL は秘密ではない）。
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const API = 'https://api.stripe.com/v1';
const SITE = 'https://techstars.studio';
const APPLY = process.argv.includes('--apply');

/** plan_code → Netlify の環境変数の名前（stripeConfig.ts の link('...') と同じ） */
const ENV_OF = {
  lms_only: 'VITE_PAY_LINK_LMS_ONLY',
  techstars_7days: 'VITE_PAY_LINK_TECHSTARS_7DAYS',
  techstars_business: 'VITE_PAY_LINK_TECHSTARS_BUSINESS',
};

/** stripeConfig.ts から PLANS を読む（TS を実行せずに済ませる。verify-stripe.mjs と同じ考え方） */
export function readPlans(src = readFileSync('services/stripeConfig.ts', 'utf8')) {
  // ★Windows で取り出すと改行が CRLF になる（そのままだと区切りが当たらず 0 件になった）
  const lf = src.replace(/\r\n/g, '\n');
  const body = lf.slice(lf.indexOf('export const PLANS'));
  const blocks = body.split(/\n {2}\{\n/).slice(1).map((b) => '\n' + b);
  const str = (b, k) => {
    const m = new RegExp(`\\n\\s+${k}:\\s*'([^']*)'`).exec(b);
    return m ? m[1] : '';
  };
  const plans = blocks.map((b) => {
    const amount = Number((/\n\s+amount:\s*(\d+)/.exec(b) ?? [])[1]);
    const feat = /features:\s*\[([\s\S]*?)\]/.exec(b);
    const features = feat ? [...feat[1].matchAll(/'([^']*)'/g)].map((m) => m[1]) : [];
    const env = (/link\('([A-Z0-9_]+)'\)/.exec(b) ?? [])[1] ?? '';
    const afterInterview = /\n\s+afterInterview:\s*true/.test(b);
    return {
      code: str(b, 'code'),
      name: str(b, 'name'),
      tagline: str(b, 'tagline'),
      taxNote: str(b, 'taxNote'),
      priceLabel: str(b, 'priceLabel'),
      amount,
      features,
      env,
      afterInterview,
    };
  });
  for (const p of plans) {
    if (!p.code || !p.name || !Number.isInteger(p.amount) || p.amount <= 0) {
      throw new Error(`stripeConfig.ts の読み取りに失敗: ${JSON.stringify(p)}`);
    }
    // ★面談の後にだけ案内するプランは LP に URL を入れない（env を読まない）。それ以外は env 名が合っていること
    if (p.afterInterview ? p.env !== '' : ENV_OF[p.code] !== p.env) {
      throw new Error(`${p.code} の環境変数名が「${p.env}」（${p.afterInterview ? '面談の後に案内するプランは env を読まない' : `この道具は ${ENV_OF[p.code]} を出す`}）`);
    }
  }
  if (plans.length !== Object.keys(ENV_OF).length) throw new Error(`プランが ${plans.length} 件（${Object.keys(ENV_OF).length} 件のはず）`);
  return plans;
}

/** 商品の名前と説明（Stripe の決済画面に出る） */
export function productOf(p) {
  // ★説明は改行が出ないので、全部の項目を並べると読めない塊になった（実画面で確認）。言い切り1つ＋項目の最初の2つだけ
  const description = [p.tagline, ...p.features.slice(0, 2)]
    .filter(Boolean)
    .map((s) => s.replace(/。$/, ''))
    .join('。')
    .concat('。');
  return { name: `TECHSTARS ${p.name}`, description };
}

/** Payment Link の中身。★ここを変えると、次に流した時に古いリンクを止めて作り直す（設定の指紋で見分ける） */
export function linkParamsOf(p, priceId) {
  return {
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    'after_completion[type]': 'redirect',
    'after_completion[redirect][url]': `${SITE}/checkout/thanks?plan=${p.code}`,
    // ★プライバシーポリシー（LP・LMS とも）に「Stripe へ氏名・カナ・メール・住所・電話・プラン・金額を渡す」と書いてある。
    //   集める物はその範囲に合わせる（増やす時は先にポリシーを直す）
    billing_address_collection: 'required',
    'phone_number_collection[enabled]': 'true',
    // ★Stripe が集める名前はカード名義（ローマ字）だけ。契約書面を簡易書留で送る宛名に漢字とカナが要るので欄を足す
    //   （入力欄は Stripe の上限の3つ。会社名は法人の名前なので個人の情報の範囲は広げない）
    'custom_fields[0][key]': 'name',
    'custom_fields[0][label][type]': 'custom',
    'custom_fields[0][label][custom]': 'お名前（漢字）',
    'custom_fields[0][type]': 'text',
    'custom_fields[0][optional]': 'false',
    'custom_fields[1][key]': 'namekana',
    'custom_fields[1][label][type]': 'custom',
    'custom_fields[1][label][custom]': 'お名前（フリガナ）',
    'custom_fields[1][type]': 'text',
    'custom_fields[1][optional]': 'false',
    'custom_fields[2][key]': 'company',
    'custom_fields[2][label][type]': 'custom',
    'custom_fields[2][label][custom]': '会社名（会社でお申し込みの場合）',
    'custom_fields[2][type]': 'text',
    'custom_fields[2][optional]': 'true',
    'custom_text[submit][message]':
      'お支払いの確認後、2営業日以内に support@techstars.studio からご連絡し、契約書面を簡易書留で郵送します。LMS のアカウントはお支払いの確認から7日以内にお知らせします。',
    customer_creation: 'always',
    // ★請求書（領収書つき）を Stripe が作る。会社の経理が受け取りに使える
    'invoice_creation[enabled]': 'true',
    'invoice_creation[invoice_data][description]': `TECHSTARS ${p.name}`,
    'invoice_creation[invoice_data][metadata][plan_code]': p.code,
    'payment_method_types[0]': 'card',
    submit_type: 'pay',
    'payment_intent_data[description]': `TECHSTARS ${p.name}`,
    'payment_intent_data[metadata][plan_code]': p.code,
    'metadata[plan_code]': p.code,
  };
}

/** 設定の指紋（同じ設定のリンクがもうあるかを見分ける。metadata に入れておく） */
export function fingerprint(params) {
  const keys = Object.keys(params).filter((k) => !k.startsWith('metadata[')).sort();
  return createHash('sha256').update(keys.map((k) => `${k}=${params[k]}`).join('\n')).digest('hex').slice(0, 16);
}

// ───────────────────────────── 自己検査 ─────────────────────────────
if (process.argv.includes('--self-test')) {
  let bad = 0;
  const ok = (cond, label) => {
    if (!cond) bad++;
    console.log(`  ${cond ? 'OK  ' : '★NG '} ${label}`);
  };
  console.log('[stripe-setup] 自己検査');
  const plans = readPlans();
  ok(plans.length === 3 && plans.filter((p) => p.afterInterview).length === 2, `PLANS を3件読めた・面談の後に案内するのは2件（${plans.map((p) => `${p.code}=${p.amount}`).join(', ')}）`);
  ok(plans.every((p) => p.features.length > 0), '全プランの項目を読めた');
  const a = linkParamsOf(plans[0], 'price_x');
  const b = linkParamsOf(plans[0], 'price_y');
  ok(fingerprint(a) !== fingerprint(b), '価格が変わると指紋が変わる');
  ok(fingerprint(a) === fingerprint({ ...a, 'metadata[fp]': 'z' }), 'metadata は指紋に入れない');
  ok(a['after_completion[redirect][url]'].endsWith(`?plan=${plans[0].code}`), '戻り先に ?plan= が付く');
  const broken = readFileSync('services/stripeConfig.ts', 'utf8').replace(/amount: 437800/, 'amount: 0');
  let threw = false;
  try {
    readPlans(broken);
  } catch {
    threw = true;
  }
  ok(threw, '金額が壊れた stripeConfig.ts は読み取りで止まる');
  if (bad) {
    console.error('[stripe-setup] 自己検査に失敗');
    process.exit(1);
  }
  console.log('[stripe-setup] 自己検査 合格');
  process.exit(0);
}

// ───────────────────────────── Stripe ─────────────────────────────
const key = (process.env.STRIPE_SECRET_KEY ?? '').trim();
if (!/^(sk|rk)_(test|live)_/.test(key)) {
  console.error('[stripe-setup] STRIPE_SECRET_KEY（sk_ か rk_）を環境変数に入れて実行すること。このリポジトリに書かないこと。');
  process.exit(1);
}
const LIVE = key.includes('_live_');

function form(params) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null) u.append(k, String(v));
  return u.toString();
}

async function call(method, path, params, idem) {
  const headers = { Authorization: `Bearer ${key}` };
  let body;
  if (params && method !== 'GET') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = form(params);
  }
  if (idem) headers['Idempotency-Key'] = idem;
  for (let i = 0; ; i++) {
    const r = await fetch(API + path + (method === 'GET' && params ? `?${form(params)}` : ''), { method, headers, body });
    const j = await r.json();
    // ★同じ鍵の同時実行は 409（idempotency_key_in_use）。少し待てば同じ結果が返る
    if (r.status === 409 && i < 3) {
      await new Promise((res) => setTimeout(res, 600));
      continue;
    }
    if (!r.ok) throw new Error(`${method} ${path}: ${j?.error?.message ?? `HTTP ${r.status}`}`);
    return j;
  }
}

async function listAll(path, params = {}) {
  const out = [];
  let after;
  for (;;) {
    const j = await call('GET', path, { limit: 100, ...params, ...(after ? { starting_after: after } : {}) });
    out.push(...j.data);
    if (!j.has_more) return out;
    after = j.data[j.data.length - 1].id;
  }
}

const idemOf = (...parts) => `techstars-setup-${createHash('sha256').update(parts.join('|')).digest('hex').slice(0, 32)}`;

const account = await call('GET', '/account');
const plans = readPlans();
console.log(`[stripe-setup] ${LIVE ? '★本番' : 'テスト'}  アカウント ${account.id}（${account.settings?.dashboard?.display_name ?? '-'}）  ${APPLY ? '書き込む' : '見るだけ（--apply で書く）'}`);
if (LIVE && !account.charges_enabled) {
  console.error('[stripe-setup] ★本番のアカウントがまだ決済を受け付けられない（charges_enabled=false）。Stripe の画面でアカウントの有効化を終えてから流すこと。');
  process.exit(1);
}

const products = await listAll('/products');
const links = await listAll('/payment_links', { active: 'true' });
const actions = [];
const envLines = [];
const sendLines = [];

for (const p of plans) {
  const want = productOf(p);
  let prod = products.find((x) => x.metadata?.plan_code === p.code && x.active) ?? products.find((x) => x.metadata?.plan_code === p.code);

  // 1. 商品
  if (!prod) {
    actions.push(`${p.code}: 商品を作る「${want.name}」`);
    if (APPLY) {
      prod = await call('POST', '/products', { ...want, 'metadata[plan_code]': p.code }, idemOf('prod', p.code, want.name));
    }
  } else if (prod.name !== want.name || prod.description !== want.description || !prod.active) {
    actions.push(`${p.code}: 商品の名前・説明を直す「${prod.name}」→「${want.name}」`);
    if (APPLY) prod = await call('POST', `/products/${prod.id}`, { ...want, active: 'true' });
  }

  // 2. 価格
  const prices = prod ? await listAll('/prices', { product: prod.id, active: 'true' }) : [];
  let price = prices.find((x) => x.currency === 'jpy' && x.unit_amount === p.amount && x.type === 'one_time');
  if (!price) {
    actions.push(`${p.code}: 価格 ¥${p.amount.toLocaleString('ja-JP')} を作る`);
    if (APPLY) {
      price = await call(
        'POST',
        '/prices',
        {
          product: prod.id,
          currency: 'jpy',
          unit_amount: p.amount,
          tax_behavior: 'inclusive',
          nickname: `${want.name} 一括（${p.taxNote}）`,
          'metadata[plan_code]': p.code,
          'metadata[tax_note]': p.taxNote,
          ...(p.priceLabel ? { 'metadata[price_label]': p.priceLabel } : {}),
        },
        idemOf('price', p.code, String(p.amount), prod.id),
      );
    }
  }
  if (prod && price && prod.default_price !== price.id) {
    actions.push(`${p.code}: 既定の価格を ¥${p.amount.toLocaleString('ja-JP')} に付け替える`);
    if (APPLY) await call('POST', `/products/${prod.id}`, { default_price: price.id });
  }
  for (const old of prices.filter((x) => !price || x.id !== price.id)) {
    actions.push(`${p.code}: 古い価格 ¥${(old.unit_amount ?? 0).toLocaleString('ja-JP')}（${old.id}）を止める`);
    if (APPLY) await call('POST', `/prices/${old.id}`, { active: 'false' });
  }

  // 3. Payment Link
  const params = price ? linkParamsOf(p, price.id) : linkParamsOf(p, '(作る価格)');
  const fp = fingerprint(params);
  const mine = links.filter((l) => l.metadata?.plan_code === p.code);
  let link = mine.find((l) => l.metadata?.fp === fp);
  if (!link) {
    actions.push(`${p.code}: 決済リンクを作る`);
    if (APPLY) {
      link = await call('POST', '/payment_links', { ...params, 'metadata[fp]': fp }, idemOf('link', p.code, fp));
    }
  }
  for (const old of mine.filter((l) => !link || l.id !== link.id)) {
    actions.push(`${p.code}: 古い決済リンク ${old.id} を止める`);
    if (APPLY) {
      await call('POST', `/payment_links/${old.id}`, {
        active: 'false',
        inactive_message: 'このお申し込みのリンクは使えなくなりました。最新の料金とお申し込みは https://techstars.studio/ をご覧ください。',
      });
    }
  }
  if (link && p.afterInterview) sendLines.push(`${p.name}（¥${p.amount.toLocaleString('ja-JP')}）: ${link.url}`);
  else if (link) envLines.push(`${ENV_OF[p.code]}=${link.url}`);
}

console.log(actions.length ? actions.map((a) => '  - ' + a).join('\n') : '  変える物はありません（もうそろっています）');
if (!APPLY && actions.length) console.log('\n[stripe-setup] 見るだけで終わりました。書くには --apply を付けて流す。');
if (envLines.length + sendLines.length === plans.length) {
  console.log(`\n[stripe-setup] Netlify の環境変数（${LIVE ? '本番' : '★テスト。本番のビルドには入れない'}）:`);
  for (const l of envLines) console.log('  ' + l);
  console.log(`\n[stripe-setup] 面談を受けた方にだけ送るリンク（LP には載せない）${LIVE ? '' : '★テスト'}:`);
  for (const l of sendLines) console.log('  ' + l);
}
