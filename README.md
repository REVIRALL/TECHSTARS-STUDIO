# TECHSTARS-STUDIO

**https://techstars.studio** で配信しているサービスLPの正本リポジトリ。

React 19 + Vite 6 + Tailwind (CDN) の SPA。プライバシーポリシー・利用規約・特定商取引法に基づく表記は
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

## 決済導線（2026-09-21 追加）

料金プランのセクション（`components/Pricing.tsx`）から Stripe の **Payment Link** へ直接飛ばしている。
設定は `services/stripeConfig.ts` の 1 ファイルに集約。**秘密鍵は置いていないし、置いてはいけない。**

| | |
|---|---|
| 方式 | Stripe Payment Link（URL だけで完結） |
| なぜ Checkout Session でないか | サーバに `sk_` を置く必要があるが、techstars.studio の Netlify にデプロイ権限が手元に無く Functions を足せない |
| 戻り先 | `/checkout/thanks`（`components/CheckoutResult.tsx`）。SPA フォールバックで index.html が返る |
| プラン | LMSのみ ¥217,800 ／ 7日間コース ¥298,000 ／ ビジネスプラン ¥880,000（すべて税込の請求額） |

### ★今は本番で決済できない

`stripeConfig.ts` の `paymentLink` は**すべてテストモードの URL**（`buy.stripe.com/test_...`）。
Stripe アカウント自体も `charges_enabled=false` でまだ本審査を通っていない。

そのため **`isCheckoutEnabled()` が本番ホスト（techstars.studio）でのみボタンを塞ぐ**ようにしてある。
「本番前に差し替えること」とコメントに書くだけでは差し替え忘れを防げないため、実際に動くゲートにした。
テストリンクのまま公開してしまうと、テストカードで「購入できた」ことになり入金が無い、という事故になる。

本番化の手順:

1. Stripe の本審査を通す
2. live キーで `revirall-corp/05_銀行口座/stripe/register_techstars_plans.py` を流し直す
   （**テストモードの商品は本番モードへ引き継がれない**）
3. live の Payment Link を作り、`stripeConfig.ts` の `paymentLink` を `test_` 無しの URL へ差し替える
4. `npm run build` して `dist/` も一緒にコミットする

### `/checkout/cancel` は Stripe からは呼ばれない

Payment Link に `cancel_url` は存在しない（API 実測：`Received unknown parameter: cancel_url`。
対照として `active=true` は通るので、拒否はこの項目固有）。
中断した利用者は Stripe 側の戻るでブラウザ履歴を遡るだけになる。
ページを残してあるのは、将来 Checkout Session 方式（`cancel_url` あり）へ移すときにそのまま使えるため。

## 未処理

- ★**特商法のクーリングオフの記載は顧問の確認を取ること。** 2025-12-05 の打ち合わせ
  （山内顧問・齊藤弁護士）の整理では、Zoom 面談を挟む申込は電話勧誘販売＝クーリングオフ 8 日間。
  一方で**LP から直接カード決済する経路は当時存在しなかった**ので、その経路の扱いは未確認のまま
  「通信販売」として書いてある。同じ商品で経路により適用が変わる点を含めて確認が要る
- ★ナローな画面幅での実機確認ができていない（ブラウザのウィンドウ幅を変える手段が無かった）。
  クラス指定は既存セクションと同じ `grid-cols-1 lg:grid-cols-3` なので崩れないはずだが未検証
- `components/Team.tsx` の坂本純一さんが「代表 / メイン講師」表記。特商法の運営統括責任者は沼倉隆平なので、
  読み手には食い違って見える（bio は「2社経営の代表取締役」＝ご本人の会社を指す）。表記の要否は要判断
- `public/robots.txt` の Sitemap 行はコメントのまま。`sitemap.xml` は未作成
