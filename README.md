# TECHSTARS-STUDIO

**https://techstars.studio** で配信しているサービスLPの正本リポジトリ。

React 19 + Vite 6 + Tailwind（**ビルド時生成**。2026-09-21 に Play CDN から移行）の SPA。プライバシーポリシー・利用規約・特定商取引法に基づく表記は
別ページではなく `components/FixedPageOverlay.tsx` 1ファイル内のオーバーレイとして実装されている。

出自は **Google AI Studio** で生成したアプリ:
https://ai.studio/apps/drive/1Hi4U8HCcWireqNVPK5cuKO347wdVhpl5
（AI Studio 側にも同じアプリが残っている。あちらを編集しても本番には反映されないので注意）

## 開発

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # dist/ を生成
```

## ★画像は「フレーム先行」方式で運用している

サイト内のビジュアルは、**画像が無くても成立するフレーム**として先に実装してある。
画像を作って `public/img/` に置いた分だけ、順に本物の画像へ切り替わる。**コードの変更は不要**。

- 枠の定義（サイズ・PC/SP・生成プロンプト・alt）の正本は **`content/imageSlots.ts`**（20スロット / 23カット）
- 描画は **`components/ImageFrame.tsx`**
  - `public/img/` にファイルがあれば `<picture>` で表示（PC / モバイルで別カットを出し分ける）
  - 無ければ、**生成プロンプトを内蔵したプレースホルダー枠**を表示する
- 画面上の枠の `PROMPT` ボタン、または **`?prompts=1`**（`Ctrl/Cmd + Shift + I`）の一覧コンソールから
  プロンプトをコピーできる。未生成カットの残数もそこで分かる

手順の詳細・書き出し設定・優先順位は **`docs/IMAGE_GENERATION.md`**。

注意点:

- **画像に文字を焼き込まない。** 見出し・本文はすべて HTML のまま（SEO・レスポンシブのため）。
  プロンプト側にも「文字を入れるな」と明示してある
- **講師2名の顔写真は実写のまま**（`public/sakamoto.jpg` / `public/numakura.jpg`）。実在の人物なので生成画像に差し替えない
- `meta.ogp` を作ったときだけ、`index.html` の `og:image` / `twitter:image` を手で差し替える必要がある

## デプロイ

Netlify。`netlify.toml` の指定は build=`npm run build` / publish=`dist`。

`dist/` を**あえてコミットしている**。ビルド環境を用意せずそのまま配信物を差し替えられるようにするため
（このリポジトリを Netlify に接続していない期間でも、`dist/` をアップロードすれば反映できる）。
ソースを変えたら **`npm run build` を流して `dist/` も一緒にコミットする**こと。片方だけ更新すると乖離する。

## ★ビルド時の注意：GEMINI_API_KEY の有無でバンドルが変わる

`vite.config.ts` が `GEMINI_API_KEY` を `process.env.API_KEY` に差し込む。
`services/geminiService.ts` は キーが空なら即 `"APIキーが設定されていないため、AI機能を利用できません。"`
を返すので、**キーが無いビルドでは Gemini のプロンプト文字列がツリーシェイクで丸ごと消える**。

本番 Netlify には現在この環境変数が設定されていない。つまり:

- **本番と同じ成果物を作りたいなら `.env.local` を外してビルドする**
- 手元に `.env.local` を置いたままビルドすると本番とバンドルの中身が変わる（バグではない）

このリポジトリの `dist/` は **`.env.local` 無し（＝本番と同条件）でビルドしたもの**。

### ★鍵をバンドルに焼き込ませないガード

`define` に渡した値は minify 後のバンドルに **literal で埋め込まれ、ブラウザから素で読める**。
このリポジトリは **public** かつ `dist/` をコミットしているので、実キーを持ったままビルドすると
「公開リポジトリ」と「配信中のJS」の両方に鍵が載る。しかも**ビルドは成功するので気づけない**。

そのため `vite.config.ts` に抑止を入れてある。実キーらしき `GEMINI_API_KEY` があっても
バンドルには空文字が入り、警告が出る:

```
[security] GEMINI_API_KEY を検出しましたが、バンドルへの埋め込みを抑止しました。
```

実測で確認済み（2026-08-13）:

| ケース | 結果 |
|---|---|
| 鍵なし | 従来どおり。`index-BfSmYu3u.js` と完全一致（誤発火しない） |
| `GEMINI_API_KEY=AIzaSy...` | 警告が出て**バンドル内の出現 0件**（抑止される） |
| `ALLOW_INLINE_API_KEY=1` 併用 | 埋め込まれる 1件（＝抑止しているのがこのガードだと確認できる） |

**AI機能（`components/IdeaValidator.tsx`）をクライアント直叩きで本番稼働させる方法は無い。**
動かすなら鍵をサーバ側に置く必要がある（Netlify Functions で Gemini を叩くプロキシを作り、
フロントはそのエンドポイントを呼ぶ）。`ALLOW_INLINE_API_KEY=1` は検証用の逃げ道であって解決策ではない。

## セキュリティ方針（2026-09-21 の決済導線の監査で決めたこと）

決済導線を足したあと、4観点で監査して直した。**「警告を出す」で止めず、落ちる仕組みにしてある。**

| 直したこと | なぜ |
|---|---|
| `cdn.tailwindcss.com` を撤去しビルド時 Tailwind へ | バージョン無指定・SRI 無しの第三者JSが、決済リンクを描くページで DOM 全権を持っていた。CDN 側が侵害されれば `href` を書き換えて売上の宛先を変えられる。**CSP では止まらない**（`<a>` の遷移先を縛るディレクティブが無い）ので撤去以外に手が無い |
| importmap(esm.sh) を削除 | 本番では未発火だったが、`^19.2.3` を実行時解決する装填された罠。lockfile が効かず SRI も付けられない |
| CSP を追加（`script-src 'self'`） | 上の撤去で script から `'unsafe-inline'` を外せた。style だけ残るのは React の `style={{}}` があるため |
| `/assets/*` を SPA フォールバックより前に 404 へ | 存在しないハッシュ付きJSに **200+HTML が immutable で1年キャッシュ**され、白画面が再読み込みでも直らない。本番で再現した |
| `X-XSS-Protection` を `0` に、HSTS/Permissions-Policy/COOP/CORP を追加 | 前者は現行ブラウザで無効。「ヘッダが4本ある」という見かけの安心を作るだけだった |
| 決済リンクをソースから外し `VITE_PAY_LINK_*` へ | ★**ゲートがボタンを隠すだけだった。** 配信バンドルを grep すれば URL が素で取り出せ、貼れば決済画面に行けた（HTTP 200 を実測）。空なら導線ごと描画しない fail-closed に変更 |
| ホスト名 allowlist を廃止 | `techstars.studio` 以外の**全ホストで開く** fail-open だった。`.netlify.app` やプレビューで素通りする |
| `/checkout/thanks` から金額の断定を削除、`/checkout/*` を noindex | 誰でも URL を直打ちでき、自社ドメインの「偽の支払証明」を作れた |
| 法定表示の修正 | 「未経験からでも確実に」（景表法5条1号）、裏付け不能な受注実績、利用規約 第5条の列挙欠落、プライバシーポリシーの Stripe 委託・越境移転・安全管理措置・開示請求の欠落 |

### 検査（どちらも自己検査つき）

```bash
npm run build                                     # vite build + verify-dist。違反でビルドが落ちる
npm run verify:dist -- --self-test                # 検査が本当に発火するか
STRIPE_SECRET_KEY=sk_... npm run verify:stripe    # LPのPLANSとStripeの現物（金額・戻り先）を突合
npm run verify:stripe -- --self-test              # 対応を壊して赤くなるか
```

`verify-dist` は dist に `sk_`/`whsec_`/`AIza`/`buy.stripe.com/test_`/`cdn.tailwindcss.com`/`esm.sh`
が1件でもあれば **exit 1**。テストリンクを入れてビルドし、実際に落ちることを確認済み。

## 決済導線（2026-09-21 追加）

料金プランのセクション（`components/Pricing.tsx`）から Stripe の **Payment Link** へ遷移する。
戻り先は `/checkout/thanks`（`components/CheckoutResult.tsx`）。設定は `services/stripeConfig.ts`。
**秘密鍵も決済URLもソースに置かない。**

| | |
|---|---|
| 方式 | Stripe Payment Link。URLは **ビルド時に `VITE_PAY_LINK_*` から注入** |
| なぜ Checkout Session でないか | サーバに `sk_` を置く必要があるが、techstars.studio の Netlify にデプロイ権限が手元に無く Functions を足せない |
| プラン | LMSのみ ¥217,800 ／ 7日間コース ¥298,000 ／ ビジネスプラン ¥880,000（すべて税込の請求額） |

### ★今は決済できない（意図的に塞いである）

`VITE_PAY_LINK_*` を設定せずにビルドしているので、**配信物に決済URLが1本も入っていない**。
`isCheckoutEnabled()` がリンクの空を見て false を返し、ボタンは「準備中」で理由を表示する。
DOM 上に Stripe へのリンクが無いので、隠したボタンを迂回するという経路自体が無い。

Stripe アカウントも `charges_enabled=false` で本審査を通っていない。
テスト用 Payment Link は Stripe 側で `active=false` にしてある。

ローカルで確認するときだけ、gitignore 済みの `.env.local` に置いて `npm run dev`:

```
VITE_PAY_LINK_LMS_ONLY=https://buy.stripe.com/test_xxxx
VITE_PAY_LINK_TECHSTARS_7DAYS=https://buy.stripe.com/test_yyyy
VITE_PAY_LINK_TECHSTARS_BUSINESS=https://buy.stripe.com/test_zzzz
```

`.env.local` を置いたまま `npm run build` すると **verify-dist がビルドを落とす**。

本番化の手順:

1. Stripe の本審査を通す
2. live キーで `revirall-corp/05_銀行口座/stripe/register_techstars_plans.py` を流し直す
   （**テストモードの商品は本番モードへ引き継がれない**）
3. live の Payment Link を作り、Netlify の環境変数に `VITE_PAY_LINK_*` を設定
4. `npm run build` して `dist/` も一緒にコミットする
5. `STRIPE_SECRET_KEY=sk_live_... npm run verify:stripe` で金額と戻り先の対応を突合する

### `/checkout/cancel` は Stripe からは呼ばれない

Payment Link に `cancel_url` は存在しない（API 実測：`Received unknown parameter: cancel_url`。
対照として `active=true` は通るので、拒否はこの項目固有）。
将来 Checkout Session 方式（`cancel_url` あり）へ移すときのために残してある。

## 会社表記

販売業者は **株式会社リバイラル**（法人番号 7013301056505 / 代表取締役 沼倉隆平）。
2026-08-13 に 合同会社リバイラル から差し替えた。合同会社リバイラルとは**別法人**なので、
社名だけでなく責任者・所在地も株式会社のものを記載している。

該当箇所はすべて `components/FixedPageOverlay.tsx`:

| 表示箇所 | 値 |
|---|---|
| プライバシー 問い合わせ窓口 | 株式会社リバイラル |
| 利用規約 冒頭 | 「株式会社リバイラル」 |
| 特商法 販売業者 | 株式会社リバイラル |
| 特商法 運営統括責任者 | 沼倉 隆平 |
| 特商法 所在地 | 〒171-0022 東京都豊島区南池袋一丁目3番9号2F |
| 特商法 電話番号 | 03-6821-4341 |
| 特商法 メールアドレス | support@techstars.studio |
| コピーライト（3ページ） | © 2026 Revirall Co., Ltd. |

## 未処理

- **画像が1枚も入っていない。** `docs/IMAGE_GENERATION.md` の優先順位に沿って
  `hero.backdrop` → `contact.cta` → `curriculum.*` の順に作れば、少ない枚数で見栄えが変わる
- 特商法に **販売価格の記載が無い**。商材の価格が確定したら追加する
- `components/Team.tsx` の坂本純一さんが「代表 / メイン講師」表記。特商法の運営統括責任者は沼倉隆平なので、
  読み手には食い違って見える（bio は「2社経営の代表取締役」＝ご本人の会社を指す）。表記の要否は要判断
- `public/robots.txt` の Sitemap 行はコメントのまま。`sitemap.xml` は未作成
- ★**特商法のクーリングオフと、ビジネスプランの取引類型は顧問の確認を取ること。**
  2025-12-05 の打ち合わせ（山内顧問・齊藤弁護士）の整理は、LP から直接カード決済する経路が
  まだ無かった時点のもの。監査では、案件紹介と報酬配分を伴うビジネスプランが
  **業務提供誘引販売取引**に当たる可能性、LMS の提供期間が2か月を超えるなら
  **特定継続的役務提供**に当たる可能性が指摘されている。該当すると表記全体が作り直しになる
- ★同意の記録が残らない。Stripe 側の利用規約同意（`consent_collection`）を使うには
  ダッシュボードで規約URLの設定が要る（API では設定できない。自アカウントへの POST は拒否される）
- ★webhook が無く、決済に反応する仕組みが1つも無い。入金の把握は人が Stripe を見るしかない
- ★ナローな画面幅での実機確認ができていない（ブラウザのウィンドウ幅を変える手段が無かった）
