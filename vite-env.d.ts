/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Stripe Payment Link。ビルド時に注入する。未設定なら申し込み導線を描画しない。 */
  readonly VITE_PAY_LINK_LMS_ONLY?: string;
  readonly VITE_PAY_LINK_TECHSTARS_7DAYS?: string;
  readonly VITE_PAY_LINK_TECHSTARS_BUSINESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
