/**
 * LP の PLANS と Stripe 側の現物を突き合わせる。**手元でだけ走らせる**（秘密鍵が要るため）。
 *
 *   STRIPE_SECRET_KEY=sk_test_xxx npm run verify:stripe
 *
 * なぜ必要か:
 *  - `services/stripeConfig.ts` の `amount` は手入力の定数で、Stripe が実際にいくら請求するかは
 *    Stripe 側にしかない。ズレると「特定商取引法に基づく表記」の販売価格が実際の請求額と
 *    食い違う（表示価格も同じ PLANS から描いているため）。
 *  - Payment Link の URL は人間には区別のつかない乱数で、プランとの対応を1つ入れ替えても
 *    誰も気づかない。戻り先の `?plan=` も Stripe 側にあり、リポジトリからは見えない。
 *
 * 検査が効いているかは `--self-test` で確かめる（対応をわざと入れ替えて赤くなることを見る）。
 */
import { readPlans } from './plans.mjs';

const API = 'https://api.stripe.com/v1';

async function stripe(path, key) {
  const r = await fetch(API + path, { headers: { Authorization: `Bearer ${key}` } });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error?.message ?? `HTTP ${r.status}`);
  return j;
}

/**
 * ★2026-11-19〜 プランごとに値段が1つか2つ。LP から申し込む値段（amount＝regular）と、
 *   面談を受けた方にだけ送る面談特典価格（offer.amount＝offer）。リンクの metadata.price_kind で見分ける
 *   （price_kind の無い古いリンクは regular とみなす。stripe-setup.mjs の kindOfLink と同じ）。
 */
function compare(plans, links) {
  const problems = [];
  const kindOf = (l) => (l.metadata?.price_kind === 'offer' ? 'offer' : 'regular');
  for (const p of plans) {
    const want = [['regular', p.amount, 'LPの表示'], ...(p.offer ? [['offer', p.offer.amount, '面談特典価格']] : [])];
    for (const [kind, amount, label] of want) {
      const found = links.filter((x) => x.metadata?.plan_code === p.code && kindOf(x) === kind);
      if (found.length === 0) {
        problems.push(`${p.code}: ${label}（${kind}）の Payment Link が Stripe に無い`);
        continue;
      }
      if (found.length > 1) problems.push(`${p.code}: ${label}（${kind}）の有効な Payment Link が ${found.length} 本ある（どれを配るか決まらない）`);
      const l = found[0];
      const total = l.line_items?.data?.[0]?.amount_total;
      if (total !== amount) problems.push(`${p.code}: ${label} ${amount} 円 ≠ Stripe の請求 ${total} 円`);
      const back = l.after_completion?.redirect?.url ?? '';
      const q = /[?&]plan=([a-z0-9_]+)/.exec(back);
      if (!q) problems.push(`${p.code}: 戻り先URLに ?plan= が無い (${back || '未設定'})`);
      else if (q[1] !== p.code) problems.push(`${p.code}: 戻り先の ?plan=${q[1]} が対応していない`);
    }
    for (const x of links.filter((x) => x.metadata?.plan_code === p.code && kindOf(x) === 'offer' && !p.offer)) {
      problems.push(`${p.code}: 面談特典価格の無いプランに特典のリンク ${x.id} が有効のまま`);
    }
  }
  return problems;
}

if (process.argv.includes('--self-test')) {
  console.log('[verify-stripe] 自己検査: 対応をわざと壊して、検出できるか見る');
  // a は通常価格 150・面談特典価格 100 の2本、b は1本だけ
  const plans = [{ code: 'a', amount: 150, offer: { amount: 100 } }, { code: 'b', amount: 200, offer: null }];
  const link = (code, total, kind, back = code) => ({
    metadata: { plan_code: code, ...(kind ? { price_kind: kind } : {}) },
    line_items: { data: [{ amount_total: total }] },
    after_completion: { redirect: { url: `https://x/?plan=${back}` } },
  });
  const good = [link('a', 150, 'regular'), link('a', 100, 'offer'), link('b', 200)];
  const cases = [
    ['正常（対照。0件であるべき）', good, 0],
    ['金額がズレている', [link('a', 999, 'regular'), good[1], good[2]], 1],
    ['通常価格と特典価格のリンクが入れ替わっている', [link('a', 100, 'regular'), link('a', 150, 'offer'), good[2]], 2],
    ['戻り先の plan が入れ替わっている', [link('a', 150, 'regular', 'b'), good[1], good[2]], 1],
    ['Payment Link が無い', [good[1], good[2]], 1],
    ['面談特典価格のリンクが無い', [good[0], good[2]], 1],
    ['同じ種類のリンクが2本有効', [...good, link('a', 150, 'regular')], 1],
    ['特典価格の無いプランに特典のリンク', [...good, link('b', 150, 'offer')], 1],
  ];
  let bad = 0;
  for (const [label, links, expect] of cases) {
    const n = compare(plans, links).length;
    const ok = expect === 0 ? n === 0 : n >= expect;
    if (!ok) bad++;
    console.log(`  ${ok ? 'OK  ' : '★NG '} ${label} -> 検出 ${n} 件`);
  }
  if (bad) {
    console.error('[verify-stripe] 自己検査に失敗。検査そのものが壊れている。');
    process.exit(1);
  }
  console.log('[verify-stripe] 自己検査 合格');
  process.exit(0);
}

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error('[verify-stripe] STRIPE_SECRET_KEY が未設定。手元で環境変数に入れて実行すること。');
  console.error('               （このリポジトリに鍵を書かないこと。public です）');
  process.exit(1);
}

const plans = readPlans();
const { data: links } = await stripe('/payment_links?limit=100&expand[]=data.line_items', key);
const active = links.filter((l) => l.active);
console.log(`[verify-stripe] LP のプラン ${plans.length} 件 / Stripe の有効な Payment Link ${active.length} 件`);

const problems = compare(plans, active);
if (problems.length) {
  console.error('\n[verify-stripe] ★食い違い\n');
  for (const p of problems) console.error('  - ' + p);
  console.error('');
  process.exit(1);
}
console.log('[verify-stripe] OK  差分 0 件');
