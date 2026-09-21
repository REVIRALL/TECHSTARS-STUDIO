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
import { readFileSync } from 'node:fs';

const API = 'https://api.stripe.com/v1';

/** stripeConfig.ts から code と amount を読む（TSを実行せずに済ませる） */
function readPlans() {
  const src = readFileSync('services/stripeConfig.ts', 'utf8');
  const plans = [];
  const re = /code:\s*'([a-z0-9_]+)'[\s\S]*?amount:\s*(\d+)/g;
  let m;
  while ((m = re.exec(src)) !== null) plans.push({ code: m[1], amount: Number(m[2]) });
  return plans;
}

async function stripe(path, key) {
  const r = await fetch(API + path, { headers: { Authorization: `Bearer ${key}` } });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error?.message ?? `HTTP ${r.status}`);
  return j;
}

function compare(plans, links) {
  const problems = [];
  for (const p of plans) {
    const l = links.find((x) => x.metadata?.plan_code === p.code);
    if (!l) {
      problems.push(`${p.code}: 対応する Payment Link が Stripe に無い`);
      continue;
    }
    const total = l.line_items?.data?.[0]?.amount_total;
    if (total !== p.amount) {
      problems.push(`${p.code}: LPの表示 ${p.amount} 円 ≠ Stripe の請求 ${total} 円`);
    }
    const back = l.after_completion?.redirect?.url ?? '';
    const q = /[?&]plan=([a-z0-9_]+)/.exec(back);
    if (!q) problems.push(`${p.code}: 戻り先URLに ?plan= が無い (${back || '未設定'})`);
    else if (q[1] !== p.code) problems.push(`${p.code}: 戻り先の ?plan=${q[1]} が対応していない`);
  }
  return problems;
}

if (process.argv.includes('--self-test')) {
  console.log('[verify-stripe] 自己検査: 対応をわざと壊して、検出できるか見る');
  const plans = [{ code: 'a', amount: 100 }, { code: 'b', amount: 200 }];
  const good = [
    { metadata: { plan_code: 'a' }, line_items: { data: [{ amount_total: 100 }] }, after_completion: { redirect: { url: 'https://x/?plan=a' } } },
    { metadata: { plan_code: 'b' }, line_items: { data: [{ amount_total: 200 }] }, after_completion: { redirect: { url: 'https://x/?plan=b' } } },
  ];
  const cases = [
    ['正常（対照。0件であるべき）', good, 0],
    ['金額がズレている', [{ ...good[0], line_items: { data: [{ amount_total: 999 }] } }, good[1]], 1],
    ['戻り先の plan が入れ替わっている', [{ ...good[0], after_completion: { redirect: { url: 'https://x/?plan=b' } } }, good[1]], 1],
    ['Payment Link が無い', [good[1]], 1],
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
