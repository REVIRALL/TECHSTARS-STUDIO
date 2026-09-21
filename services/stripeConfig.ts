/**
 * 決済プランの設定。
 *
 * ★秘密鍵（sk_）を書かないこと。このリポジトリは public で dist/ もコミットしている。
 *
 * ★決済リンクをソースに直書きしない。
 *   以前はここに `buy.stripe.com/test_...` を直書きしていたが、それでは
 *   「本番ホストではボタンを塞ぐ」ゲートが意味をなさない。配信バンドルを grep すれば
 *   URL が素で取り出せ、アドレスバーに貼れば決済画面に到達できるため（実測で確認済み）。
 *   ボタンを隠すことと、経路を塞ぐことは別物だった。
 *
 *   そこでリンクはビルド時の環境変数から注入する。値を渡さなければ空文字になり、
 *   空なら申し込み導線そのものを描画しない（fail-closed）。
 *   ローカルで動作確認したいときだけ、gitignore 済みの `.env.local` に置く:
 *
 *     VITE_PAY_LINK_LMS_ONLY=https://buy.stripe.com/test_xxxx
 *     VITE_PAY_LINK_TECHSTARS_7DAYS=https://buy.stripe.com/test_yyyy
 *     VITE_PAY_LINK_TECHSTARS_BUSINESS=https://buy.stripe.com/test_zzzz
 *
 *   本番化するときは live の URL を Netlify の環境変数に設定してビルドする。
 *   `npm run build` は dist に `test_` リンクが混ざっていたら失敗する（scripts/verify-dist.mjs）。
 */

export interface Plan {
  code: string;
  name: string;
  tagline: string;
  /** 実際に請求される金額（円）。表示もこの値を使う。 */
  amount: number;
  /** 税の内訳表示用 */
  taxNote: string;
  features: string[];
  /** Stripe Payment Link。ビルド時に注入され、未設定なら空文字。 */
  paymentLink: string;
  highlight?: boolean;
  note?: string;
}

const env = import.meta.env as Record<string, string | undefined>;
const link = (key: string): string => (env[key] ?? '').trim();

export const PLANS: Plan[] = [
  {
    code: 'lms_only',
    name: 'LMSのみ',
    tagline: '自分のペースで、教材だけ',
    amount: 217800,
    taxNote: '198,000円 + 消費税10%',
    features: [
      '学習管理システム（LMS）の利用',
      'DAY1〜DAY7 のカリキュラム閲覧',
      '講義動画の視聴',
      'マンツーマン講義は付きません',
    ],
    paymentLink: link('VITE_PAY_LINK_LMS_ONLY'),
  },
  {
    code: 'techstars_7days',
    name: '7日間コース',
    tagline: '講師とマンツーマンで、7日間',
    amount: 298000,
    taxNote: '税込',
    features: [
      'マンツーマン講義 4回（DAY1・3・5・7）',
      'DAY1 環境構築とWeb制作、公開まで',
      'DAY3 スプレッドシート業務の自動化',
      'DAY5 データベースとサーバーの基礎',
      'DAY7 成果発表とキャリア相談',
      'LMS の利用',
      '公式LINEでの質問サポート',
    ],
    paymentLink: link('VITE_PAY_LINK_TECHSTARS_7DAYS'),
    highlight: true,
  },
  {
    code: 'techstars_business',
    name: 'ビジネスプラン',
    tagline: '案件の取り方まで、伴走する',
    amount: 880000,
    taxNote: '税込',
    features: [
      '7日間コースの全内容',
      '初回商談への同行',
      '要件定義・詳細設計・提案書作成を当社が担当',
      'プロジェクトマネジメントの代行',
      '当社案件のご紹介',
    ],
    paymentLink: link('VITE_PAY_LINK_TECHSTARS_BUSINESS'),
    note: '報酬の配分など個別の条件を個別契約で定めます。お申し込み前に条件をご確認ください。',
  },
];

/** リンクが Stripe のテストモードのものか。 */
const isTestLink = (url: string): boolean => url.includes('/test_');

/** 申し込み導線を出してよいか。★判定は「安全側に倒す」。
 *  - リンクが1本でも空なら出さない（未設定のまま公開する事故を防ぐ）
 *  - テストリンクが混ざっていたら、開発ビルド以外では出さない
 *    （以前はホスト名の allowlist で判定していたが、本番以外の全ホストで開いてしまう
 *      fail-open な作りだった。ホスト名に安全を委ねない）
 */
export const isCheckoutEnabled = (): boolean => {
  const links = PLANS.map((p) => p.paymentLink);
  if (links.some((l) => l === '')) return false;
  if (links.some(isTestLink)) return Boolean(import.meta.env.DEV);
  return true;
};

/** 画面に「テスト環境です」と出すべきか。 */
export const isTestMode = (): boolean => PLANS.some((p) => isTestLink(p.paymentLink));

/** 決済導線が止まっている理由。画面に出して黙らせない。 */
export const checkoutDisabledReason = (): string => {
  if (PLANS.some((p) => p.paymentLink === '')) return 'unconfigured';
  if (PLANS.some((p) => isTestLink(p.paymentLink))) return 'test-link-on-production';
  return '';
};

export const formatYen = (amount: number): string => `¥${amount.toLocaleString('ja-JP')}`;

export const findPlan = (code: string | null): Plan | undefined =>
  PLANS.find((p) => p.code === code);
