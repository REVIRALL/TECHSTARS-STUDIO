/**
 * SEO / AIO 監査スクリプト（辛口・100点満点）
 * ============================================================================
 * ビルド成果物 `dist/` を実際に読んで採点する。ソースではなく「配信されるHTML」を
 * 見るので、CSR で消えるコンテンツは容赦なく0点になる。
 *
 *   npm run seo
 *
 * 満点になるまで直す、という運用のための物差し。減点理由は必ず1行で出す。
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ORIGIN = 'https://techstars.studio';

/* ────────────────────────────── 小道具 ────────────────────────────── */

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);
const exists = (p) => fs.existsSync(p);
const gzipSize = (p) => (exists(p) ? zlib.gzipSync(fs.readFileSync(p)).length : 0);

/** 全角を2、半角を1として数える（日本語の meta 長さは字数ではなく幅で効く） */
const visualLen = (s) =>
  [...s].reduce((n, c) => n + (/[\x00-\x7F｡-ﾟ]/.test(c) ? 1 : 2), 0);

const ROUTES = [
  { file: 'index.html', url: '/', kind: 'home' },
  { file: 'pricing/index.html', url: '/pricing/', kind: 'sub' },
  { file: 'faq/index.html', url: '/faq/', kind: 'sub' },
  { file: 'privacy/index.html', url: '/privacy/', kind: 'sub' },
  { file: 'terms/index.html', url: '/terms/', kind: 'sub' },
  { file: 'tokushoho/index.html', url: '/tokushoho/', kind: 'sub' },
];

function loadPages() {
  return ROUTES.map((r) => {
    const html = read(path.join(DIST, r.file));
    return { ...r, html, dom: html ? parse(html) : null };
  });
}

function jsonLd(dom) {
  if (!dom) return [];
  const out = [];
  for (const el of dom.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const parsed = JSON.parse(el.rawText);
      const graph = parsed['@graph'] ?? parsed;
      out.push(...(Array.isArray(graph) ? graph : [graph]));
    } catch {
      out.push({ __invalid: true });
    }
  }
  return out;
}

const typeOf = (node) => [].concat(node?.['@type'] ?? []).map(String);
const hasType = (nodes, t) => nodes.some((n) => typeOf(n).includes(t));
const pick = (nodes, t) => nodes.find((n) => typeOf(n).includes(t));

/* ────────────────────────────── 採点 ────────────────────────────── */

const results = [];
/** @param {string} cat @param {string} id @param {number} max @param {boolean|number} ok @param {string} note */
function score(cat, id, max, ok, note = '') {
  const got = typeof ok === 'number' ? Math.max(0, Math.min(max, ok)) : ok ? max : 0;
  results.push({ cat, id, max, got, note });
  return got;
}

function run() {
  const pages = loadPages();
  const home = pages[0];
  const subs = pages.slice(1);
  const ld = jsonLd(home.dom);
  const robots = read(path.join(DIST, 'robots.txt'));
  const sitemap = read(path.join(DIST, 'sitemap.xml'));
  const llms = read(path.join(DIST, 'llms.txt'));
  const netlify = read(path.join(ROOT, 'netlify.toml'));
  const redirects = read(path.join(DIST, '_redirects'));

  if (!home.html) {
    console.error('dist/index.html がない。先に `npm run build` を流すこと。');
    process.exit(1);
  }

  const bodyText = home.dom.querySelector('body')?.text.replace(/\s+/g, ' ').trim() ?? '';

  /* ══════════════ A. インデックス基盤 (22) ══════════════ */
  const A = 'A. インデックス基盤';

  score(
    A, 'A1 プリレンダリング（本文がHTMLに存在するか）', 8,
    bodyText.length >= 2500 && bodyText.includes('7日'),
    `body のテキスト量 ${bodyText.length}字（2500字以上必要）。JSを実行しないAIクローラーはここしか読まない`
  );

  const canonical = home.dom.querySelector('link[rel="canonical"]')?.getAttribute('href');
  score(
    A, 'A2 canonical（自己参照・絶対URL）', 2,
    canonical === `${ORIGIN}/`,
    `canonical=${canonical ?? 'なし'}`
  );

  score(A, 'A3 robots.txt に Sitemap 行', 2,
    !!robots && /^\s*Sitemap:\s*https:\/\//im.test(robots),
    robots ? 'Sitemap 行が無効/未記載' : 'robots.txt が dist に無い');

  const sitemapUrls = sitemap ? [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : [];
  const wantUrls = ROUTES.map((r) => ORIGIN + r.url);
  score(A, 'A4 sitemap.xml（全ページ掲載・lastmod付き）', 2,
    sitemapUrls.length > 0 &&
      wantUrls.every((u) => sitemapUrls.includes(u)) &&
      /<lastmod>/.test(sitemap ?? ''),
    `掲載 ${sitemapUrls.length}/${wantUrls.length} 件`);

  const subsBuilt = subs.filter((p) => p.html).length;
  score(A, 'A5 法務/FAQ/料金が実URLを持つ', 3, (subsBuilt / subs.length) * 3,
    `${subsBuilt}/${subs.length} ページ生成済み。オーバーレイのみだとクロールも被リンクも不可能`);

  const hasSpaCatchAll =
    (netlify && /from\s*=\s*"\/\*"[\s\S]{0,120}status\s*=\s*200/.test(netlify)) ||
    (redirects && /^\s*\/\*\s+\/index\.html\s+200/m.test(redirects));
  score(A, 'A6 存在しないURLが200を返さない（ソフト404対策）', 2, !hasSpaCatchAll && exists(path.join(DIST, '404.html')),
    hasSpaCatchAll ? '/* → /index.html 200 のcatch-allが残っている' : '404.html が無い');

  const titles = pages.filter((p) => p.html).map((p) => p.dom.querySelector('title')?.text ?? '');
  const descs = pages
    .filter((p) => p.html)
    .map((p) => p.dom.querySelector('meta[name="description"]')?.getAttribute('content') ?? '');
  const uniqueTitle = new Set(titles).size === titles.length && !titles.includes('');
  const uniqueDesc = new Set(descs).size === descs.length && !descs.includes('');
  score(A, 'A7 全ページでtitle/descriptionが一意', 3, (uniqueTitle ? 1.5 : 0) + (uniqueDesc ? 1.5 : 0),
    `title一意=${uniqueTitle} / description一意=${uniqueDesc}`);

  /* ══════════════ B. メタデータ (14) ══════════════ */
  const B = 'B. メタデータ';
  const title = titles[0] ?? '';
  const desc = descs[0] ?? '';

  score(B, 'B1 title（全角30字前後・固有名+検索語）', 2,
    visualLen(title) >= 24 && visualLen(title) <= 64 && /TECHSTARS|TechStars/i.test(title),
    `"${title}" 幅${visualLen(title)}（24〜64が安全域）`);

  score(B, 'B2 meta description（全角60〜80字）', 2,
    visualLen(desc) >= 110 && visualLen(desc) <= 170,
    `幅${visualLen(desc)}（110〜170が安全域）`);

  const og = Object.fromEntries(
    home.dom
      .querySelectorAll('meta[property^="og:"]')
      .map((m) => [m.getAttribute('property'), m.getAttribute('content')])
  );
  const ogNeed = ['og:type', 'og:title', 'og:description', 'og:url', 'og:image', 'og:site_name', 'og:locale', 'og:image:width', 'og:image:height', 'og:image:alt'];
  const ogHit = ogNeed.filter((k) => og[k]);
  const ogAbs = (og['og:image'] ?? '').startsWith('https://') && (og['og:url'] ?? '').startsWith('https://');
  score(B, 'B3 OGP一式（絶対URL・寸法・alt）', 3, (ogHit.length / ogNeed.length) * 2 + (ogAbs ? 1 : 0),
    `${ogHit.length}/${ogNeed.length} 項目, 絶対URL=${ogAbs}。相対パスのog:imageはSNSで展開されない`);

  const tw = Object.fromEntries(
    home.dom
      .querySelectorAll('meta[name^="twitter:"]')
      .map((m) => [m.getAttribute('name'), m.getAttribute('content')])
  );
  score(B, 'B4 Twitterカード', 2,
    tw['twitter:card'] === 'summary_large_image' &&
      (tw['twitter:image'] ?? '').startsWith('https://') &&
      !!tw['twitter:title'] && !!tw['twitter:description'],
    JSON.stringify(tw));

  score(B, 'B5 meta keywords を撤去', 1, !home.dom.querySelector('meta[name="keywords"]'),
    'keywords は無効化されて久しく、素人サイトの指標にしかならない');

  score(B, 'B6 theme-color / color-scheme', 2,
    !!home.dom.querySelector('meta[name="theme-color"]') &&
      !!home.dom.querySelector('meta[name="color-scheme"]'),
    '黒基調サイトでcolor-scheme未指定だとフォーム類が白浮きする');

  const iconOk =
    !!home.dom.querySelector('link[rel="icon"][type="image/svg+xml"], link[rel="icon"][sizes]') &&
    !!home.dom.querySelector('link[rel="apple-touch-icon"]') &&
    !!home.dom.querySelector('link[rel="manifest"]') &&
    exists(path.join(DIST, 'site.webmanifest'));
  score(B, 'B7 ファビコン一式 + manifest', 2, iconOk,
    '60KBのlogo.pngをそのままfaviconにするのは論外');

  /* ══════════════ C. 構造化データ (22) ══════════════ */
  const C = 'C. 構造化データ';

  score(C, 'C1 JSON-LDが構文的に妥当', 3, ld.length > 0 && !ld.some((n) => n.__invalid),
    `ノード数 ${ld.length}`);

  const orgNode = pick(ld, 'Organization') ?? pick(ld, 'EducationalOrganization');
  const orgFields = ['name', 'url', 'logo', 'sameAs', 'contactPoint', 'address'];
  const orgHit = orgNode ? orgFields.filter((f) => orgNode[f]) : [];
  score(C, 'C2 Organization（logo/sameAs/住所/連絡先）', 3, (orgHit.length / orgFields.length) * 3,
    orgNode ? `${orgHit.length}/${orgFields.length} 項目` : 'Organization ノードが無い');

  score(C, 'C3 WebSite / WebPage', 2,
    hasType(ld, 'WebSite') && hasType(ld, 'WebPage'), '');

  const course = pick(ld, 'Course');
  const offer = course?.offers ?? pick(ld, 'Offer');
  const courseOk =
    !!course &&
    !!course.provider &&
    !!course.hasCourseInstance &&
    !!offer &&
    String(offer.price ?? '') === '398000' &&
    offer.priceCurrency === 'JPY';
  score(C, 'C4 Course + hasCourseInstance + offers(価格/通貨)', 4, courseOk,
    course ? `provider=${!!course.provider} instance=${!!course.hasCourseInstance} price=${offer?.price}` : 'Course ノードが無い');

  const faq = pick(ld, 'FAQPage');
  const qa = faq?.mainEntity?.length ?? 0;
  score(C, 'C5 FAQPage（5問以上・本文と一致）', 3, qa >= 5 ? 3 : (qa / 5) * 3, `Q&A ${qa}件`);

  const persons = ld.filter((n) => typeOf(n).includes('Person'));
  score(C, 'C6 Person（講師のE-E-A-T）', 2,
    persons.length >= 2 && persons.every((p) => p.jobTitle && p.description), `${persons.length}名`);

  const subBreadcrumb = subs.filter((p) => p.html && hasType(jsonLd(p.dom), 'BreadcrumbList')).length;
  score(C, 'C7 下層ページのBreadcrumbList', 2, subs.length ? (subBreadcrumb / subs.length) * 2 : 0,
    `${subBreadcrumb}/${subs.length} ページ`);

  const webpage = pick(ld, 'WebPage');
  score(C, 'C8 @id連結 / inLanguage / dateModified', 3,
    (ld.some((n) => n['@id']) ? 1 : 0) +
      (webpage?.inLanguage === 'ja' ? 1 : 0) +
      (webpage?.dateModified ? 1 : 0),
    'エンティティが繋がっていないとナレッジグラフに載らない');

  /* ══════════════ D. セマンティクス / A11y (14) ══════════════ */
  const D = 'D. セマンティクス/A11y';

  const headingIssues = [];
  let h1Ok = 0;
  let levelOk = 0;
  for (const p of pages.filter((x) => x.html)) {
    const hs = p.dom.querySelectorAll('h1,h2,h3,h4,h5,h6');
    const h1 = hs.filter((h) => h.tagName === 'H1').length;
    if (h1 === 1) h1Ok++;
    else headingIssues.push(`${p.url}: h1が${h1}個`);
    let prev = 0;
    let skip = false;
    for (const h of hs) {
      const lv = Number(h.tagName[1]);
      if (prev && lv > prev + 1) {
        skip = true;
        headingIssues.push(`${p.url}: h${prev}→h${lv}`);
      }
      prev = lv;
    }
    if (!skip) levelOk++;
  }
  const built = pages.filter((x) => x.html).length;
  score(D, 'D1 h1が各ページ1つ', 2, (h1Ok / built) * 2, headingIssues.filter((s) => s.includes('h1が')).join(' / '));
  score(D, 'D2 見出しレベルの飛びが無い', 2, (levelOk / built) * 2, headingIssues.filter((s) => s.includes('→')).join(' / '));

  const imgs = home.dom.querySelectorAll('img');
  const imgAlt = imgs.filter((i) => i.getAttribute('alt') !== undefined || i.getAttribute('aria-hidden') === 'true');
  const imgDim = imgs.filter((i) => i.getAttribute('width') && i.getAttribute('height'));
  score(D, 'D3 img に alt と width/height', 2,
    imgs.length ? ((imgAlt.length / imgs.length) + (imgDim.length / imgs.length)) : 0,
    `img ${imgs.length}枚 / alt ${imgAlt.length} / 寸法 ${imgDim.length}`);

  const deadLinks = pages
    .filter((p) => p.html)
    .flatMap((p) => p.dom.querySelectorAll('a[href="#"]').map(() => p.url));
  score(D, 'D4 href="#" の死んだリンクが無い', 2, deadLinks.length === 0, `${deadLinks.length}箇所`);

  const mailtoOk = home.html.includes('mailto:support@techstars.studio');
  const telOk = pages.some((p) => p.html && p.html.includes('tel:0368214341'));
  score(D, 'D5 メール/電話がリンクになっている', 2, (mailtoOk ? 1 : 0) + (telOk ? 1 : 0), `mailto=${mailtoOk} tel=${telOk}`);

  const langOk = /<html[^>]+lang="ja"/.test(home.html);
  const mainOk = !!home.dom.querySelector('main');
  const skipOk = !!home.dom.querySelector('a[href="#main"], a.skip-link');
  score(D, 'D6 lang / main / スキップリンク', 2, ((langOk ? 1 : 0) + (mainOk ? 1 : 0) + (skipOk ? 1 : 0)) / 3 * 2,
    `lang=${langOk} main=${mainOk} skip=${skipOk}`);

  let dlOk = true;
  for (const dl of home.dom.querySelectorAll('dl')) {
    const kids = dl.querySelectorAll('dt,dd');
    if (kids.length && kids[0].tagName !== 'DT') dlOk = false;
  }
  score(D, 'D7 dl は dt→dd の順', 2, dlOk, 'ddが先に来るdlはマークアップとして不正');

  /* ══════════════ E. パフォーマンス (18) ══════════════ */
  const E = 'E. パフォーマンス';

  score(E, 'E1 Tailwind CDN を使っていない', 5, !home.html.includes('cdn.tailwindcss.com'),
    'CDN版は公式に本番非推奨。約120KBのJSがレンダーをブロックし、FOUCとCLSを生む');

  /**
   * 「外部stylesheetがあるか」ではなく「レンダーをブロックするか」を見る。
   * media="print" + onload で all に戻す形と、<noscript> 内のフォールバックは
   * どちらも初回描画を止めないので対象外。
   */
  const noscriptHtml = home.dom.querySelectorAll('noscript').map((n) => n.innerHTML).join('');
  const blockingCss = home.dom
    .querySelectorAll('link[rel="stylesheet"]')
    .filter((l) => /^https?:\/\//.test(l.getAttribute('href') ?? ''))
    .filter((l) => (l.getAttribute('media') ?? 'all') !== 'print')
    .filter((l) => !noscriptHtml.includes(l.getAttribute('href') ?? ' '));
  score(E, 'E2 外部CSSがレンダーをブロックしない', 3, blockingCss.length === 0,
    `レンダーをブロックする外部stylesheet ${blockingCss.length}件（Google Fontsは非同期化するか自前配信する）`);

  const preloadImg = home.dom.querySelector('link[rel="preload"][as="image"]');
  score(E, 'E3 LCP画像をpreload', 3, !!preloadImg,
    'ヒーロー背景がJS実行後に発見される状態だとLCPが致命的に遅れる');

  const jsFiles = exists(path.join(DIST, 'assets'))
    ? fs.readdirSync(path.join(DIST, 'assets')).filter((f) => f.endsWith('.js'))
    : [];
  const entryJs = jsFiles
    .filter((f) => home.html.includes(f))
    .reduce((n, f) => n + gzipSize(path.join(DIST, 'assets', f)), 0);
  score(E, 'E4 初期JSが軽い（gzip 120KB未満）', 3, entryJs > 0 && entryJs < 120 * 1024 ? 3 : entryJs < 160 * 1024 ? 1.5 : 0,
    `初期JS gzip ${(entryJs / 1024).toFixed(1)}KB`);

  const rasterHeavy = ['logo.png', 'sakamoto.jpg', 'numakura.jpg']
    .filter((f) => exists(path.join(DIST, f)) && fs.statSync(path.join(DIST, f)).size > 60 * 1024);
  score(E, 'E5 主要画像がWebP/軽量', 2, rasterHeavy.length === 0, `60KB超のPNG/JPEG: ${rasterHeavy.join(', ') || 'なし'}`);

  score(E, 'E6 本番HTMLにimportmap/esm.shが残っていない', 2,
    !home.html.includes('esm.sh') && !home.html.includes('importmap'),
    'バンドル済みなのにCDNのimportmapが残るのは死荷重');

  /* ══════════════ F. AIO (10) ══════════════ */
  const F = 'F. AIO（生成AI最適化）';

  score(F, 'F1 llms.txt', 2, !!llms && llms.includes('# ') && llms.length > 400, 'LLM向けの要約経路が無い');

  const aiBots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'OAI-SearchBot'];
  const botHit = robots ? aiBots.filter((b) => robots.includes(b)) : [];
  score(F, 'F2 robots.txt でAIクローラーを明示許可', 2, (botHit.length / aiBots.length) * 2,
    `${botHit.length}/${aiBots.length} 明記`);

  const facts = ['398,000円', '7日間', '株式会社リバイラル', 'オンライン'];
  const factHit = facts.filter((f) => bodyText.includes(f));
  score(F, 'F3 主要ファクトが静的HTMLに平文で存在', 2, (factHit.length / facts.length) * 2,
    `${factHit.length}/${facts.length}（欠落: ${facts.filter((f) => !bodyText.includes(f)).join(', ') || 'なし'}）`);

  const faqPage = pages.find((p) => p.url === '/faq/');
  const faqText = faqPage?.dom?.querySelector('body')?.text ?? '';
  const faqInHome = bodyText.includes('未経験でも') || bodyText.includes('未経験者');
  score(F, 'F4 FAQ本文が静的HTMLに出ている', 2,
    (faqText.includes('未経験') ? 1 : 0) + (faqInHome ? 1 : 0),
    'AIは開かれていないモーダルの中身を読めない');

  score(F, 'F5 更新日時が機械可読', 2,
    !!home.dom.querySelector('time[datetime]') && !!webpage?.dateModified, '');

  /* ────────────────────────────── 出力 ────────────────────────────── */
  const total = results.reduce((n, r) => n + r.got, 0);
  const max = results.reduce((n, r) => n + r.max, 0);

  const byCat = new Map();
  for (const r of results) {
    if (!byCat.has(r.cat)) byCat.set(r.cat, []);
    byCat.get(r.cat).push(r);
  }

  console.log('\n════════════════════════════════════════════════════════════');
  console.log('  TECHSTARS-STUDIO  SEO / AIO 監査');
  console.log('════════════════════════════════════════════════════════════');
  for (const [cat, rows] of byCat) {
    const sub = rows.reduce((n, r) => n + r.got, 0);
    const subMax = rows.reduce((n, r) => n + r.max, 0);
    console.log(`\n▍${cat}  ${sub.toFixed(1)} / ${subMax}`);
    for (const r of rows) {
      const full = r.got >= r.max - 1e-9;
      const mark = full ? '✅' : r.got > 0 ? '⚠️ ' : '❌';
      console.log(`  ${mark} [${r.got.toFixed(1)}/${r.max}] ${r.id}`);
      if (!full && r.note) console.log(`        └ ${r.note}`);
    }
  }
  const pct = (total / max) * 100;
  console.log('\n────────────────────────────────────────────────────────────');
  console.log(`  合計: ${total.toFixed(1)} / ${max}  →  ${pct.toFixed(1)} 点`);
  console.log('────────────────────────────────────────────────────────────\n');

  if (process.env.SEO_STRICT === '1' && pct < 100) process.exit(1);
}

run();
