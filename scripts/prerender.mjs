/**
 * プリレンダリング（SSG）
 * ============================================================================
 * `vite build` が吐いた dist/index.html を雛形に、ルートごとの静的HTMLを書き出す。
 *
 * これが無いと dist/index.html の <body> は <div id="root"></div> だけで、
 * JavaScript を実行しないクローラー（GPTBot / ClaudeBot / PerplexityBot /
 * 各種SNSのOGP取得botなど）にとっては「空のページ」でしかなかった。
 * Googlebot はJSを実行できるが、レンダリング待ち行列に入るぶん反映が遅れる。
 *
 * あわせて sitemap.xml / robots.txt / llms.txt もここで生成する。
 * ページ定義（content/site.ts）が唯一の供給元なので、ページを足せば
 * sitemap もパンくずも自動で追随する。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SSR_ENTRY = path.join(ROOT, 'dist-ssr', 'entry-server.js');

const HEAD_MARK = '<!--SEO_HEAD-->';
const APP_MARK = '<!--APP_HTML-->';

function fail(msg) {
  console.error(`\n[prerender] ${msg}\n`);
  process.exit(1);
}

const template = (() => {
  const p = path.join(DIST, 'index.html');
  if (!fs.existsSync(p)) fail('dist/index.html が無い。先に vite build を流すこと');
  const html = fs.readFileSync(p, 'utf8');
  if (!html.includes(HEAD_MARK)) fail(`雛形に ${HEAD_MARK} が無い`);
  if (!html.includes(APP_MARK)) fail(`雛形に ${APP_MARK} が無い`);
  return html;
})();

if (!fs.existsSync(SSR_ENTRY)) fail('dist-ssr/entry-server.js が無い。vite build --ssr を先に流すこと');

const server = await import(pathToFileURL(SSR_ENTRY).href);
const { ROUTES, ORIGIN, BUILD_DAY, FAQS, COURSE, ORG, renderRoute } = server;

/* ────────────────────────────── HTML ────────────────────────────── */

let bytes = 0;
for (const route of ROUTES) {
  const { head, html } = renderRoute(route, '');
  const out = template.replace(HEAD_MARK, head.trimStart()).replace(APP_MARK, html);
  const dest = path.join(DIST, route.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, out);
  bytes += Buffer.byteLength(out);
  console.log(`  ✓ ${route.file.padEnd(24)} ${route.path.padEnd(14)} ${(Buffer.byteLength(out) / 1024).toFixed(1)}KB`);
}

/* ────────────────────────────── sitemap.xml ────────────────────────────── */

const indexable = ROUTES.filter((r) => r.indexable);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  indexable
    .map(
      (r) =>
        `  <url>\n` +
        `    <loc>${ORIGIN}${r.path}</loc>\n` +
        `    <lastmod>${BUILD_DAY}</lastmod>\n` +
        `    <changefreq>${r.key === 'home' ? 'weekly' : 'monthly'}</changefreq>\n` +
        `    <priority>${r.priority.toFixed(1)}</priority>\n` +
        `  </url>`
    )
    .join('\n') +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
console.log(`  ✓ sitemap.xml            ${indexable.length} URL`);

/* ────────────────────────────── robots.txt ────────────────────────────── */

/**
 * AIクローラーを名指しで許可する。
 * `User-agent: *` で足りるはずだが、明示しておくと
 *  - 意図して開いているのだと運用上わかる
 *  - Google-Extended（AI Overviews / Gemini の学習・生成利用）は
 *    別枠の扱いなので、書いていないと将来の既定変更に巻き込まれる
 * 逆に読ませたくない領域ができたら、ここに Disallow を足す。
 */
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
];

/**
 * robots.txt のグループは継承しない。User-agent ごとに独立したルール集合なので、
 * `User-agent: *` に書いた Disallow は GPTBot には一切効かない。
 * 全グループに同じ本文を出す。
 */
const RULES = `Allow: /\n# 画像生成プロンプトの作業台。ユーザー向けの情報ではない\nDisallow: /*?prompts=\n`;

const robots =
  `# ${ORG.brand} — ${ORIGIN}\n` +
  `# 生成: scripts/prerender.mjs（手で編集しない）\n\n` +
  ['*', ...AI_BOTS].map((b) => `User-agent: ${b}\n${RULES}`).join('\n') +
  `\nSitemap: ${ORIGIN}/sitemap.xml\n`;
fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);
console.log(`  ✓ robots.txt             AIクローラー ${AI_BOTS.length} 種を明示`);

/* ────────────────────────────── llms.txt ────────────────────────────── */

/**
 * llms.txt — 生成AI向けの「このサイトは何か」の要約。
 * HTMLを読み解かせるより、事実を平文で置いた方が引用が正確になる。
 * 価格や連絡先を間違って要約されるのが一番まずいので、数字は明記する。
 */
const llms =
  `# ${ORG.brand}（${ORG.legalName}）\n\n` +
  `> ${ORIGIN}/ — 未経験から${COURSE.durationLabel}で、動くシステムを3つ作るAI開発スクール。` +
  `受講生はコードを暗記せず、Claude Code などのAIに指示を出して開発を進める。${COURSE.mode}。\n\n` +
  `## 基本情報\n\n` +
  `- 提供者: ${ORG.legalName}（${ORG.englishName}）\n` +
  `- ブランド名: ${ORG.brand}（アクセラレーターの Techstars とは無関係の別事業者）\n` +
  `- プログラム名: ${COURSE.name}\n` +
  `- 期間: ${COURSE.durationLabel}（講義4回 + 自習3日）\n` +
  `- 形式: ${COURSE.mode}、マンツーマンメンタリング付き、日本全国から受講可\n` +
  `- 受講料: ${COURSE.price.toLocaleString('ja-JP')}円（${COURSE.priceNote}）\n` +
  `- 別途必要: ${COURSE.extras}\n` +
  `- 対象: ${COURSE.prerequisites}\n` +
  `- 所在地: ${ORG.address}\n` +
  `- 連絡先: ${ORG.email} / ${ORG.tel}\n` +
  `- 最終更新: ${BUILD_DAY}\n\n` +
  `## 受講後にできるようになること\n\n` +
  COURSE.outcomes.map((o) => `- ${o}`).join('\n') +
  `\n\n## ページ\n\n` +
  indexable.map((r) => `- [${r.breadcrumb}](${ORIGIN}${r.path}): ${r.description}`).join('\n') +
  `\n\n## よくある質問\n\n` +
  FAQS.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n') +
  `\n`;
fs.writeFileSync(path.join(DIST, 'llms.txt'), llms);
console.log(`  ✓ llms.txt               ${(Buffer.byteLength(llms) / 1024).toFixed(1)}KB`);

console.log(`\n  静的HTML ${ROUTES.length} ページ / 合計 ${(bytes / 1024).toFixed(1)}KB\n`);
