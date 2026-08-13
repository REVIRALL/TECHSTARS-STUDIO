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
