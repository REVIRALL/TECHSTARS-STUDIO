/**
 * サイト全体の「事実」の正本
 * ============================================================================
 * タイトル・説明文・料金・FAQ・講師・会社情報を1箇所にまとめる。
 *
 * ここが以下すべての供給元になる:
 *   - 画面に出る本文（FixedPageOverlay / StandalonePage）
 *   - <head> のメタタグ
 *   - JSON-LD 構造化データ
 *   - sitemap.xml / llms.txt
 *
 * 表示とマークアップが同じ値を見ているので、「構造化データにだけ古い価格が
 * 残る」という典型的な事故が起きない。Googleは本文と構造化データの不一致を
 * スパム扱いするので、この一元化は見た目以上に重要。
 */

export const ORIGIN = 'https://techstars.studio';

/**
 * ビルド時刻。dateModified / sitemap の lastmod / フッターの最終更新日に使う。
 *
 * vite.config.ts の define でビルド時の値が literal として焼き込まれる。
 * ブラウザ側で new Date() を呼ぶと「閲覧者の今日」になってしまい、
 * 更新日として意味を成さない上にハイドレーション不一致も起こす。
 */
declare const __BUILD_DATE__: string;

export const BUILD_DATE = typeof __BUILD_DATE__ === 'string' ? __BUILD_DATE__ : '1970-01-01T00:00:00.000Z';

export const BUILD_DAY = BUILD_DATE.slice(0, 10);

/* ────────────────────────────── 運営者 ────────────────────────────── */

export const ORG = {
  name: '株式会社リバイラル',
  legalName: '株式会社リバイラル',
  englishName: 'Revirall Co., Ltd.',
  brand: 'TECHSTARS STUDIO',
  email: 'support@techstars.studio',
  tel: '03-6821-4341',
  telUri: 'tel:0368214341',
  postalCode: '171-0022',
  region: '東京都',
  locality: '豊島区',
  street: '南池袋一丁目3番9号2F',
  get address() {
    return `〒${this.postalCode} ${this.region}${this.locality}${this.street}`;
  },
  representative: '沼倉 隆平',
  /**
   * sameAs は「同一エンティティであること」の外部証明。
   * 実在しないURLを並べると逆効果なので、確認できたものだけを載せる。
   * SNSアカウントを開設したらここに足す。
   */
  sameAs: ['https://techstars-lms.netlify.app/'] as string[],
} as const;

/* ────────────────────────────── プログラム ────────────────────────────── */

export const COURSE = {
  name: 'TECHSTARS STUDIO 7日間AI開発プログラム',
  shortName: '7日間AI開発プログラム',
  programId: '7DAYS-PRO-2026',
  price: 398000,
  currency: 'JPY',
  priceNote: '税別',
  durationISO: 'P7D',
  durationLabel: '7日間',
  mode: 'オンライン完結',
  /** 講義3回・自習3回の内訳。Course.hasCourseInstance に使う */
  lectureCount: 4,
  repeatCount: 3,
  extras: 'Claude Pro（月額20米ドル〜）の契約が別途必要',
  outcomes: [
    'AIに指示を出してLP・ポートフォリオサイトを実装し、レスポンシブ対応まで完了できる',
    'Google Apps ScriptでGmail自動返信・スプレッドシート集計・Slack通知を構築できる',
    'Render と Supabase でDBを持つWebアプリを設計し、本番環境にデプロイできる',
    '見積書・提案書のテンプレートを使って案件の受注活動を始められる',
  ],
  prerequisites: 'プログラミング未経験可。PC（Mac / Windows）とインターネット環境が必要',
} as const;

/* ────────────────────────────── 講師 ────────────────────────────── */

export interface Instructor {
  name: string;
  role: string;
  bio: string;
  image: string;
  /** JSON-LD 用の職種名 */
  jobTitle: string;
}

export const INSTRUCTORS: Instructor[] = [
  {
    name: '坂本 純一',
    role: '代表 / メイン講師',
    jobTitle: '代表取締役 / メイン講師',
    bio: '2社経営の代表取締役。創業80期を迎える老舗企業を率いながら、AI駆動開発の最前線で実践中。',
    image: '/img/sakamoto.jpg',
  },
  {
    name: '沼倉 隆平',
    role: 'AIスペシャリスト',
    jobTitle: 'AIスペシャリスト / 講師',
    bio: 'AI×開発のスペシャリスト。1000万円クラスの案件を1ヶ月で20本受注した超実践派。',
    image: '/img/numakura.jpg',
  },
];

/* ────────────────────────────── FAQ ────────────────────────────── */

export interface Faq {
  q: string;
  a: string;
}

/**
 * FAQPage 構造化データと画面表示の両方がここを見る。
 * 回答は「その1問だけ読んでも意味が通る」文にしておく。
 * 生成AIは段落単位で切り出して引用するので、文脈依存の書き方は引用されない。
 */
export const FAQS: Faq[] = [
  {
    q: 'プログラミング未経験でも参加できますか？',
    a: 'はい、未経験者も歓迎です。TECHSTARS STUDIOの7日間AI開発プログラムはAIに指示を出して開発を進めるため、コードを暗記する必要がありません。基礎から順を追って指導するので、Progateなどで挫折した方でも進められます。',
  },
  {
    q: '7日間でどこまでのスキルが身につきますか？',
    a: 'AIと協働してWebアプリケーションを開発できるレベルを目指します。具体的には、LP・ポートフォリオサイトの実装、Google Apps Scriptによる業務自動化、Supabaseを使ったデータベース連携アプリの本番デプロイまでを7日間で行い、動くシステムが3つ手元に残ります。',
  },
  {
    q: '受講料はいくらですか？',
    a: '受講料は398,000円（税別）です。クレジットカード決済と銀行振込に対応しています。分割払いをご希望の場合はお問い合わせください。この金額に7日間のカリキュラム、マンツーマンメンタリング、学習サポートツールと専用サイトの2ヶ月無料利用、卒業証明書の発行、卒業生コミュニティへの永久参加権が含まれます。',
  },
  {
    q: 'Claude Proの契約は必要ですか？',
    a: 'はい、受講には Claude Pro のサブスクリプション（月額20米ドル〜）が受講料とは別に必要です。契約方法は受講開始前にご案内します。',
  },
  {
    q: 'オンライン完結とのことですが、サポート体制は？',
    a: '講師がマンツーマンでサポートします。チャットとビデオ通話で質問でき、講義日は1回60〜90分、その間の日は自習という構成です。オンライン完結なので日本全国どこからでも受講できます。',
  },
  {
    q: '受講に必要なものは何ですか？',
    a: 'PC（Mac または Windows）とインターネット環境があれば受講できます。加えて Claude アカウントと、コマンドライン（ターミナル）を使用します。カリキュラムにより使用ツールは異なります。',
  },
  {
    q: '卒業後はどうなりますか？',
    a: '卒業生限定のSlackコミュニティに永久参加できます。案件情報の共有、仕事の紹介・受け渡し、技術相談を卒業生同士で継続できます。学習サポートツールは卒業後2ヶ月間無料で利用可能です。',
  },
  {
    q: '仕事をしながらでも受講できますか？',
    a: '受講できます。講師とのセッションは1回60〜90分で、残りは自分のペースで進める自習日です。平日夜や週末に時間を確保して7日分を消化する受講生が多くいます。',
  },
  {
    q: '返金やキャンセルはできますか？',
    a: 'デジタルコンテンツの性質上、決済完了後の返品・キャンセルはお受けしていません。ただし提供内容に欠陥がある場合はこの限りではありません。詳細は特定商取引法に基づく表記をご確認ください。',
  },
];

/* ────────────────────────────── ページ定義 ────────────────────────────── */

export type RouteKey = 'home' | 'pricing' | 'faq' | 'privacy' | 'terms' | 'tokushoho' | 'notfound';

export interface RouteMeta {
  key: RouteKey;
  /** 末尾スラッシュ付きの配信パス */
  path: string;
  /** 出力先（dist からの相対） */
  file: string;
  title: string;
  description: string;
  /** パンくずに出す短い名前 */
  breadcrumb: string;
  /** sitemap に載せるか */
  indexable: boolean;
  priority: number;
}

export const ROUTES: RouteMeta[] = [
  {
    key: 'home',
    path: '/',
    file: 'index.html',
    title: '7日間でプロへ｜AI開発スクール TECHSTARS STUDIO',
    description:
      '未経験から7日間で、動くシステムを3つ作るAI開発スクール。コードは書かず、Claude Codeへの指示で開発します。オンライン完結・マンツーマン指導、受講料398,000円（税別）。',
    breadcrumb: 'ホーム',
    indexable: true,
    priority: 1.0,
  },
  {
    key: 'pricing',
    path: '/pricing/',
    file: 'pricing/index.html',
    title: '料金プラン・受講料398,000円｜TECHSTARS STUDIO',
    description:
      'TECHSTARS STUDIO 7日間AI開発プログラムの受講料は398,000円（税別）。含まれるもの、支払い方法、別途必要になるClaude Proの費用、特典の内訳をすべて公開しています。',
    breadcrumb: '料金プラン',
    indexable: true,
    priority: 0.9,
  },
  {
    key: 'faq',
    path: '/faq/',
    file: 'faq/index.html',
    title: 'よくある質問｜7日間AI開発プログラム TECHSTARS STUDIO',
    description:
      '未経験でも受講できるか、7日間で何が身につくか、受講料と支払い方法、Claude Proの要否、卒業後のサポートまで。TECHSTARS STUDIOに寄せられる質問への回答をまとめました。',
    breadcrumb: 'よくある質問',
    indexable: true,
    priority: 0.8,
  },
  {
    key: 'privacy',
    path: '/privacy/',
    file: 'privacy/index.html',
    title: 'プライバシーポリシー｜TECHSTARS STUDIO',
    description:
      'TECHSTARS STUDIO（株式会社リバイラル）における個人情報の定義、収集方法、利用目的、第三者提供の考え方、お問い合わせ窓口を定めたプライバシーポリシーです。',
    breadcrumb: 'プライバシーポリシー',
    indexable: true,
    priority: 0.3,
  },
  {
    key: 'terms',
    path: '/terms/',
    file: 'terms/index.html',
    title: '利用規約｜TECHSTARS STUDIO',
    description:
      '株式会社リバイラルが提供する TECHSTARS STUDIO のサービス利用条件を定めた利用規約です。適用範囲、利用登録、利用料金、禁止事項、免責事項、準拠法を記載しています。',
    breadcrumb: '利用規約',
    indexable: true,
    priority: 0.3,
  },
  {
    key: 'tokushoho',
    path: '/tokushoho/',
    file: 'tokushoho/index.html',
    title: '特定商取引法に基づく表記｜TECHSTARS STUDIO',
    description:
      'TECHSTARS STUDIO の販売業者、運営統括責任者、所在地、電話番号、受講料以外に必要な費用、支払方法と時期、役務の提供時期、返品・キャンセルの取扱いを表示しています。',
    breadcrumb: '特定商取引法に基づく表記',
    indexable: true,
    priority: 0.3,
  },
  {
    key: 'notfound',
    path: '/404.html',
    file: '404.html',
    title: 'ページが見つかりません｜TECHSTARS STUDIO',
    description: 'お探しのページは見つかりませんでした。',
    breadcrumb: 'ページが見つかりません',
    indexable: false,
    priority: 0,
  },
];

export const routeByKey = (key: RouteKey): RouteMeta =>
  ROUTES.find((r) => r.key === key) ?? ROUTES[0];

/** パス（末尾スラッシュ有無を問わない）からルートを引く。クライアント側の分岐に使う */
export function routeForPath(pathname: string): RouteMeta {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return (
    ROUTES.find((r) => (r.path.replace(/\/+$/, '') || '/') === normalized) ?? routeByKey('home')
  );
}

/* ────────────────────────────── OGP ────────────────────────────── */

export const OGP = {
  /** SNSクローラーの互換性を優先してJPEGを正とする。WebPを読めない配信先がまだある */
  url: `${ORIGIN}/img/ogp.jpg`,
  width: 1200,
  height: 630,
  alt: 'TECHSTARS STUDIO — 7日間でプロへ。AIと作る、動くシステム3つ。',
} as const;
