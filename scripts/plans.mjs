/**
 * services/stripeConfig.ts の PLANS を読む（TS を実行せずに済ませる）。stripe-setup.mjs と verify-stripe.mjs が使う。
 *
 * ★読み方は書き方に縛られている。stripeConfig.ts の PLANS は
 *   - プランごとに `  {` で始まる（2字下げ）
 *   - `amount:` を1行に、面談特典価格は `offer: { amount: …, taxNote: '…', label: '…' }` を1行に書く
 *   この形を崩すと readPlans が止まる（黙って違う値を読まない）。
 * ★Windows で取り出すと改行が CRLF になる（そのままだと区切りが当たらず 0 件になった）。
 */
import { readFileSync } from 'node:fs';

/** plan_code → LP の環境変数（stripeConfig.ts の link('...') と同じ）。LP から申し込む＝通常価格のリンク */
export const ENV_OF = {
  lms_only: 'VITE_PAY_LINK_LMS_ONLY',
  techstars_7days: 'VITE_PAY_LINK_TECHSTARS_7DAYS',
  techstars_business: 'VITE_PAY_LINK_TECHSTARS_BUSINESS',
};

export function readPlans(src = readFileSync('services/stripeConfig.ts', 'utf8')) {
  const lf = src.replace(/\r\n/g, '\n');
  const body = lf.slice(lf.indexOf('export const PLANS'));
  const blocks = body.split(/\n {2}\{\n/).slice(1).map((b) => '\n' + b);
  const str = (b, k) => {
    const m = new RegExp(`\\n\\s+${k}:\\s*'([^']*)'`).exec(b);
    return m ? m[1] : '';
  };
  const plans = blocks.map((b) => {
    const amount = Number((/\n\s+amount:\s*(\d+)/.exec(b) ?? [])[1]);
    const o = /\n\s+offer:\s*\{\s*amount:\s*(\d+),\s*taxNote:\s*'([^']*)',\s*label:\s*'([^']*)'\s*\}/.exec(b);
    const feat = /features:\s*\[([\s\S]*?)\]/.exec(b);
    return {
      code: str(b, 'code'),
      name: str(b, 'name'),
      tagline: str(b, 'tagline'),
      taxNote: str(b, 'taxNote'),
      amount,
      offer: o ? { amount: Number(o[1]), taxNote: o[2], label: o[3] } : null,
      hasOfferLine: /\n\s+offer:/.test(b),
      features: feat ? [...feat[1].matchAll(/'([^']*)'/g)].map((m) => m[1]) : [],
      env: (/link\('([A-Z0-9_]+)'\)/.exec(b) ?? [])[1] ?? '',
    };
  });
  for (const p of plans) {
    if (!p.code || !p.name || !Number.isInteger(p.amount) || p.amount <= 0) {
      throw new Error(`stripeConfig.ts の読み取りに失敗: ${JSON.stringify(p)}`);
    }
    if (p.hasOfferLine && !p.offer) throw new Error(`${p.code}: offer の行を読めない（1行で amount・taxNote・label の順に書くこと）`);
    if (p.offer && !(p.offer.amount > 0 && p.offer.amount < p.amount)) {
      throw new Error(`${p.code}: 面談特典価格 ${p.offer.amount} が通常価格 ${p.amount} より安くない`);
    }
    if (ENV_OF[p.code] !== p.env) throw new Error(`${p.code} の環境変数名が「${p.env}」（${ENV_OF[p.code]} のはず）`);
    delete p.hasOfferLine;
  }
  if (plans.length !== Object.keys(ENV_OF).length) throw new Error(`プランが ${plans.length} 件（${Object.keys(ENV_OF).length} 件のはず）`);
  return plans;
}
