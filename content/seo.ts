/**
 * <head> と JSON-LD の生成
 * ============================================================================
 * content/site.ts の事実だけを材料に、ページごとの head 文字列を組み立てる。
 * ビルド時（scripts/prerender.mjs）に一度だけ実行され、静的HTMLに焼き込まれる。
 * ブラウザ側では一切動かないので、バンドルサイズには影響しない。
 *
 * 構造化データは @id で相互参照する1つのグラフにしている。
 * 単発のノードを並べるより、Organization ⇄ WebSite ⇄ WebPage ⇄ Course が
 * 繋がっている方が、検索エンジンにも生成AIにも「同一の事業者の話」として届く。
 */

import {
  BUILD_DATE,
  COURSE,
  FAQS,
  HOME_FAQ_COUNT,
  INSTRUCTORS,
  OGP,
  ORG,
  ORIGIN,
  ROUTES,
  RouteMeta,
} from './site';

const ID = {
  org: `${ORIGIN}/#organization`,
  site: `${ORIGIN}/#website`,
  course: `${ORIGIN}/#course`,
  page: (path: string) => `${ORIGIN}${path}#webpage`,
  person: (name: string) => `${ORIGIN}/#person-${encodeURIComponent(name.replace(/\s+/g, ''))}`,
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ────────────────────────────── ノード ────────────────────────────── */

function organizationNode() {
  return {
    '@type': ['EducationalOrganization', 'Organization'],
    '@id': ID.org,
    name: ORG.brand,
    legalName: ORG.legalName,
    alternateName: [ORG.englishName, 'テックスターズスタジオ'],
    url: `${ORIGIN}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${ORIGIN}/logo.png`,
      width: 512,
      height: 512,
      caption: `${ORG.brand} ロゴ`,
    },
    image: OGP.url,
    description: `${ORG.legalName}が運営するAI開発スクール。7日間で動くシステムを3つ作る実践型プログラムを提供している。`,
    email: ORG.email,
    telephone: ORG.tel,
    address: {
      '@type': 'PostalAddress',
      postalCode: ORG.postalCode,
      addressRegion: ORG.region,
      addressLocality: ORG.locality,
      streetAddress: ORG.street,
      addressCountry: 'JP',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: ORG.email,
        telephone: ORG.tel,
        areaServed: 'JP',
        availableLanguage: ['ja'],
      },
    ],
    sameAs: ORG.sameAs,
    founder: INSTRUCTORS.map((i) => ({ '@id': ID.person(i.name) })),
  };
}

function personNodes() {
  return INSTRUCTORS.map((i) => ({
    '@type': 'Person',
    '@id': ID.person(i.name),
    name: i.name,
    jobTitle: i.jobTitle,
    description: i.bio,
    image: `${ORIGIN}${i.image}`,
    worksFor: { '@id': ID.org },
    knowsAbout: ['AI駆動開発', 'Claude Code', 'Webアプリケーション開発', '業務自動化'],
  }));
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ID.site,
    url: `${ORIGIN}/`,
    name: ORG.brand,
    description: ROUTES[0].description,
    inLanguage: 'ja',
    publisher: { '@id': ID.org },
  };
}

function courseNode() {
  return {
    '@type': 'Course',
    '@id': ID.course,
    name: COURSE.name,
    description: `未経験からでも7日間で、Webサイト・業務自動化ツール・データベース連携アプリの3つを作りきるAI開発プログラム。コードを暗記せず、AIへの指示で開発を進める。オンライン完結。`,
    url: `${ORIGIN}/`,
    courseCode: COURSE.programId,
    inLanguage: 'ja',
    provider: { '@id': ID.org },
    educationalLevel: '入門〜実践',
    teaches: COURSE.outcomes,
    coursePrerequisites: COURSE.prerequisites,
    timeRequired: COURSE.durationISO,
    /**
     * hasCourseInstance が無い Course はリッチリザルトの対象外になる。
     * 開催日が固定でないので startDate は入れず、提供形態だけを明示する。
     */
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: COURSE.durationISO,
      inLanguage: 'ja',
      location: {
        '@type': 'VirtualLocation',
        url: `${ORIGIN}/`,
      },
      instructor: INSTRUCTORS.map((i) => ({ '@id': ID.person(i.name) })),
    },
    offers: {
      '@type': 'Offer',
      price: String(COURSE.price),
      priceCurrency: COURSE.currency,
      availability: 'https://schema.org/InStock',
      category: 'Paid',
      url: `${ORIGIN}/pricing/`,
      seller: { '@id': ID.org },
    },
  };
}

/**
 * FAQPage。
 *
 * `count` は「そのページに実際に表示されている問数」でなければならない。
 * 構造化データに書いてあるのに本文に無いQ&Aは、Googleの構造化データ
 * ガイドライン違反（ページに表示されていないコンテンツのマークアップ）であり、
 * 手動対策の対象になりうる。トップは HOME_FAQ_COUNT 件しか出していないので、
 * トップのグラフもその件数に揃える。
 */
function faqNode(pageUrl: string, count: number) {
  return {
    '@type': 'FAQPage',
    '@id': `${ORIGIN}${pageUrl}#faq`,
    inLanguage: 'ja',
    mainEntity: FAQS.slice(0, count).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function breadcrumbNode(route: RouteMeta) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${ORIGIN}${route.path}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: route.breadcrumb, item: `${ORIGIN}${route.path}` },
    ],
  };
}

function webPageNode(route: RouteMeta) {
  const isHome = route.key === 'home';
  return {
    '@type': isHome ? ['WebPage', 'CollectionPage'] : 'WebPage',
    '@id': ID.page(route.path),
    url: `${ORIGIN}${route.path}`,
    name: route.title,
    description: route.description,
    inLanguage: 'ja',
    isPartOf: { '@id': ID.site },
    about: { '@id': ID.course },
    publisher: { '@id': ID.org },
    datePublished: '2026-01-15T00:00:00+09:00',
    dateModified: BUILD_DATE,
    primaryImageOfPage: { '@type': 'ImageObject', url: OGP.url, width: OGP.width, height: OGP.height },
    ...(isHome ? {} : { breadcrumb: { '@id': `${ORIGIN}${route.path}#breadcrumb` } }),
  };
}

/** ページごとに載せる @graph を組み立てる */
export function graphFor(route: RouteMeta) {
  const nodes: object[] = [organizationNode(), websiteNode(), webPageNode(route), ...personNodes()];

  if (route.key === 'home' || route.key === 'pricing') nodes.push(courseNode());
  // トップは抜粋（HOME_FAQ_COUNT件）、/faq/ は全問を表示している
  if (route.key === 'home') nodes.push(faqNode('/', HOME_FAQ_COUNT));
  if (route.key === 'faq') nodes.push(faqNode('/faq/', FAQS.length));
  if (route.key !== 'home' && route.key !== 'notfound') nodes.push(breadcrumbNode(route));

  return { '@context': 'https://schema.org', '@graph': nodes };
}

/* ────────────────────────────── head ────────────────────────────── */

/**
 * LCP候補のヒーロー背景。JSの実行を待たずにプリロードスキャナに拾わせる。
 * ImageFrame が <picture> で出し分けるのと同じ条件を media で再現している。
 */
const HERO_PRELOAD = `
    <link rel="preload" as="image" href="/img/hero-backdrop-desktop.webp" type="image/webp" media="(min-width: 768px)" fetchpriority="high">
    <link rel="preload" as="image" href="/img/hero-backdrop-mobile.webp" type="image/webp" media="(max-width: 767px)" fetchpriority="high">`;

export function headFor(route: RouteMeta, assetTags = ''): string {
  const url = `${ORIGIN}${route.path}`;
  const canonical = route.key === 'notfound' ? '' : url;
  const graph = JSON.stringify(graphFor(route));

  return [
    `<meta charset="UTF-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`,
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}">`,
    canonical ? `<link rel="canonical" href="${canonical}">` : '',
    route.indexable
      ? `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`
      : `<meta name="robots" content="noindex, follow">`,
    `<meta name="author" content="${esc(ORG.legalName)}">`,
    `<meta name="theme-color" content="#000000">`,
    `<meta name="color-scheme" content="dark">`,
    `<meta name="format-detection" content="telephone=no">`,
    '',
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(ORG.brand)}">`,
    `<meta property="og:title" content="${esc(route.title)}">`,
    `<meta property="og:description" content="${esc(route.description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:locale" content="ja_JP">`,
    `<meta property="og:image" content="${OGP.url}">`,
    `<meta property="og:image:secure_url" content="${OGP.url}">`,
    `<meta property="og:image:type" content="image/jpeg">`,
    `<meta property="og:image:width" content="${OGP.width}">`,
    `<meta property="og:image:height" content="${OGP.height}">`,
    `<meta property="og:image:alt" content="${esc(OGP.alt)}">`,
    '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(route.title)}">`,
    `<meta name="twitter:description" content="${esc(route.description)}">`,
    `<meta name="twitter:image" content="${OGP.url}">`,
    `<meta name="twitter:image:alt" content="${esc(OGP.alt)}">`,
    '',
    `<link rel="icon" href="/favicon.ico" sizes="32x32">`,
    `<link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192">`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`,
    `<link rel="manifest" href="/site.webmanifest">`,
    '',
    route.key === 'home' ? HERO_PRELOAD.trim() : '',
    '',
    assetTags.trim(),
    '',
    `<script type="application/ld+json">${graph.replace(/</g, '\\u003c')}</script>`,
  ]
    .filter((l) => l !== '')
    .map((l) => `    ${l}`)
    .join('\n');
}
