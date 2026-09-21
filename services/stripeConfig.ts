/**
 * 決済プランの設定。
 *
 * ★このファイルに秘密鍵（sk_）を書かないこと。
 *   このリポジトリは public で、さらに dist/ をコミットしている。
 *   ここに置いてよいのは「公開されても問題ないもの」＝ Payment Link の URL と表示用の文言だけ。
 *
 * なぜ Payment Link なのか:
 *   Checkout Session をサーバで作る方式は sk_ が要るが、techstars.studio の Netlify に
 *   デプロイ権限が手元に無く Functions を足せない。Payment Link は URL だけで完結する。
 *
 * ★本番化の手順（テストのままでは決済が通らない）:
 *   1. Stripe の本審査を通す（現在 charges_enabled=false）
 *   2. live キーで `revirall-corp/05_銀行口座/stripe/register_techstars_plans.py` を流し直す
 *      （テストモードの商品は本番モードへ引き継がれない）
 *   3. live の Payment Link を作り、下の paymentLink を `buy.stripe.com/xxxx`（test_ なし）へ差し替える
 *   4. `npm run build` して dist/ も一緒にコミットする
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
  /** Stripe Payment Link。test_ を含む間は本番ホストでボタンを塞ぐ。 */
  paymentLink: string;
  highlight?: boolean;
  note?: string;
}

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
    paymentLink: 'https://buy.stripe.com/test_3cIcN446O4hN1cTbNh5os03',
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
    paymentLink: 'https://buy.stripe.com/test_eVq4gy0UCcOjf3JaJd5os01',
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
    paymentLink: 'https://buy.stripe.com/test_aFa3cudHodSn1cT6sX5os02',
    note: '報酬の配分など個別の条件があります。お申し込み前にご相談ください。',
  },
];

/** Payment Link がテストモードのものか。1本でも test_ が混ざれば true。 */
export const IS_TEST_MODE = PLANS.some((p) => p.paymentLink.includes('/test_'));

const PRODUCTION_HOSTS = ['techstars.studio', 'www.techstars.studio'];

export const isProductionHost = (): boolean =>
  typeof window !== 'undefined' && PRODUCTION_HOSTS.includes(window.location.hostname);

/**
 * ★ゲート。本番ホストにテストリンクが載った状態では決済ボタンを塞ぐ。
 * コメントで「本番前に差し替えること」と書くだけでは、差し替え忘れを防げないため。
 * テスト用リンクのまま公開すると、テストカードで「購入できた」ことになり入金がない。
 */
export const isCheckoutEnabled = (): boolean => !(IS_TEST_MODE && isProductionHost());

export const formatYen = (amount: number): string => `¥${amount.toLocaleString('ja-JP')}`;

export const findPlan = (code: string | null): Plan | undefined =>
  PLANS.find((p) => p.code === code);
