/**
 * 配信物(dist/)の検査。`npm run build` の一部として必ず走り、1件でも当たれば **ビルドを落とす**。
 *
 * なぜ必要か:
 *  - このリポジトリは public で dist/ もコミットしている。一度混入したものは git 履歴に残り、
 *    force push しても GitHub の古いオブジェクトは消えない。
 *  - 警告を出すだけの検査は、無いのと同じだった（実際 vite.config.ts の鍵抑止は警告のみで、
 *    抑止が外れていても気づけない構造だった）。ここは exit 1 で止める。
 *
 * 検査が本当に効いているかは `npm run verify:dist -- --self-test` で確かめられる。
 * 各ルールにわざと当たる文字列を食わせて、全部が検出されることを見る。
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

/** @type {{name: string, re: RegExp, why: string}[]} */
const RULES = [
  {
    name: 'stripe-secret-key',
    re: /sk_(?:live|test)_[A-Za-z0-9]{20,}/,
    why: 'Stripe の秘密鍵が配信物に入っている。即座にローテーションすること。',
  },
  {
    name: 'stripe-webhook-secret',
    re: /whsec_[A-Za-z0-9]{20,}/,
    why: 'Webhook 署名シークレットが配信物に入っている。',
  },
  {
    name: 'google-api-key',
    re: /AIza[0-9A-Za-z_-]{30,}/,
    why: 'Google API キーが配信物に焼き込まれている。vite.config.ts の抑止が外れている。',
  },
  {
    name: 'stripe-test-payment-link',
    re: /buy\.stripe\.com\/test_/,
    why:
      'Stripe の **テスト用** Payment Link が配信物に入っている。' +
      'これを公開するとテストカードで「購入できた」ことになり入金がない。' +
      'VITE_PAY_LINK_* に live の URL を設定してビルドし直すこと。',
  },
  {
    name: 'tailwind-play-cdn',
    re: /cdn\.tailwindcss\.com/,
    why:
      '第三者CDNのスクリプトが配信物に残っている。バージョン無指定・SRI 無しで、' +
      '決済リンクを描くページのDOM全権を持つため撤去したはずの経路。',
  },
  {
    name: 'importmap-esm-sh',
    re: /esm\.sh\//,
    why: 'importmap 経由の esm.sh 参照が残っている。lockfile が効かず SRI も付けられない。',
  },
];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function scanText(label, text) {
  const hits = [];
  for (const r of RULES) {
    const m = text.match(r.re);
    if (m) hits.push({ rule: r.name, why: r.why, sample: m[0].slice(0, 24), label });
  }
  return hits;
}

function selfTest() {
  console.log('[verify-dist] 自己検査: 各ルールにわざと当たる文字列を食わせる');
  const bait = {
    'stripe-secret-key': 'sk_test_' + 'A'.repeat(24),
    'stripe-webhook-secret': 'whsec_' + 'B'.repeat(24),
    'google-api-key': 'AIza' + 'C'.repeat(32),
    'stripe-test-payment-link': 'https://buy.stripe.com/test_abc',
    'tailwind-play-cdn': 'https://cdn.tailwindcss.com',
    'importmap-esm-sh': 'https://esm.sh/react@19',
  };
  let bad = 0;
  for (const r of RULES) {
    const fired = r.re.test(bait[r.name] ?? '');
    console.log(`  ${fired ? 'OK  ' : '★NG '} ${r.name}`);
    if (!fired) bad++;
  }
  // 対照: 無害な文字列で誤発火しないこと
  const control = 'pk_test_' + 'D'.repeat(40) + ' https://buy.stripe.com/abcdef https://fonts.googleapis.com';
  const falsePositives = RULES.filter((r) => r.re.test(control));
  console.log(
    falsePositives.length === 0
      ? '  OK   対照（公開してよい文字列）で誤発火なし'
      : `  ★NG 対照で誤発火: ${falsePositives.map((r) => r.name).join(', ')}`
  );
  bad += falsePositives.length;
  if (bad > 0) {
    console.error(`[verify-dist] 自己検査に失敗（${bad}件）。検査そのものが壊れている。`);
    process.exit(1);
  }
  console.log('[verify-dist] 自己検査 合格');
}

if (process.argv.includes('--self-test')) {
  selfTest();
  process.exit(0);
}

if (!existsSync(DIST)) {
  console.error(`[verify-dist] ${DIST}/ が無い。先に vite build を走らせること。`);
  process.exit(1);
}

const files = walk(DIST).filter((f) => /\.(js|mjs|css|html|json|map|txt)$/i.test(f));
const hits = files.flatMap((f) => scanText(f, readFileSync(f, 'utf8')));

if (hits.length > 0) {
  console.error('\n[verify-dist] ★配信物に出してはいけないものが入っている\n');
  for (const h of hits) {
    console.error(`  ${h.rule}  (${h.label})`);
    console.error(`    検出: ${h.sample}...`);
    console.error(`    理由: ${h.why}\n`);
  }
  console.error(`[verify-dist] ${hits.length} 件。ビルドを失敗させる。\n`);
  process.exit(1);
}

console.log(`[verify-dist] OK  ${files.length} ファイルを検査し、違反 0 件`);
