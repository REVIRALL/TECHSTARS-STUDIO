# 画像の作り方・入れ方

このサイトの画像は **「枠（フレーム）だけ先に作ってある」** 状態で運用する。
画像を1枚も持っていなくてもサイトは成立し、画像を作った分だけ順に差し替わっていく。

コードを触る必要は無い。やることは2つだけ。

1. プロンプトをコピーして画像を作る
2. できた画像を決まった名前で `public/img/` に置く

---

## 1. プロンプトの取り出し方

### A. サイト上の枠から取る（おすすめ）

`npm run dev` でサイトを開くと、まだ画像が入っていない場所は
斜めハッチの枠に `PROMPT` ボタンが出ている。押すとその枠専用のプロンプトが開く。

- **PC / モバイルのタブ**で、それぞれのカット用プロンプトを切り替えられる
- **保存先ファイル名**もそこに表示される。この名前で保存すれば自動で反映される
- `プロンプトをコピー` を押してそのまま画像生成AIに貼る

### B. 一覧からまとめて取る

URL の末尾に `?prompts=1` を付ける（例: `http://localhost:3000/?prompts=1`）。
キーボードの `Ctrl + Shift + I`（Mac は `Cmd + Shift + I`）でも開く。

- 全カットの一覧と、**どれが未生成か**が一目で分かる
- `全プロンプトをまとめてコピー` で全部を一括取得できる
- `JSONで書き出す` で機械可読な形でも取れる（API で一括生成したい場合用）

### C. ソースから直接読む

正本は `content/imageSlots.ts`。文言を変えたい場合もここだけ直せばよい。

---

## 2. 画像の作り方

### ChatGPT / GPT Image で作る場合

コピーしたプロンプトを**そのまま1つ貼る**。加工しなくてよい。
プロンプト内に「絶対に文字を入れない」「使ってよい色」「空けておく領域」まで
書き込んであるので、追加指示は基本的に不要。

うまくいかないときに効く追撃指示:

| 症状 | 追撃 |
|---|---|
| 文字やロゴが写り込む | `Remove all text, letters and logos. The image must contain zero readable characters.` |
| 色が派手（紫・オレンジが出る） | `Strictly two tones only: near-black and electric cyan #00E5FF. Remove every other hue.` |
| ごちゃごちゃして情報量が多い | `Simplify. Remove 60% of the detail. Increase empty black negative space.` |
| 明るすぎる / 白っぽい | `Much darker overall. Background must be near-black #050507. Lower exposure two stops.` |
| 見出しが乗る場所が明るい | `Keep the left half of the frame empty black.`（該当枠のみ） |

### Midjourney で作る場合

プロンプト末尾に `Midjourney params` を付けてある。`--ar` は枠ごとに違うので消さないこと。

### 一括生成したい場合

`?prompts=1` → `JSONで書き出す` で得た JSON に、各カットの `path` と `prompt` が入っている。
そのまま画像生成 API に流し、返ってきた画像を `path` の位置に保存すればよい。

---

## 3. 画像の置き方

### ファイル名

**プロンプト画面に表示される保存先の名前をそのまま使う。** 例:

```
public/img/hero-backdrop-desktop.webp
public/img/hero-backdrop-mobile.webp
public/img/flow-01-desktop.webp
```

規則は `スロットID の . を - に置換` + `-desktop` or `-mobile` + `.webp`。

### 書き出し設定

| 項目 | 値 |
|---|---|
| 形式 | WebP（品質 82〜88） |
| サイズ | プロンプトに書かれた **最小** サイズ以上。大きい分には縮小されるので問題ない |
| カラープロファイル | sRGB |
| 目標ファイルサイズ | 全画面背景は 400KB 以下、カード用は 150KB 以下 |

生成AIの出力は PNG のことが多い。変換例:

```bash
# ImageMagick
magick input.png -resize 2880x -quality 85 public/img/hero-backdrop-desktop.webp

# cwebp
cwebp -q 85 -resize 2880 0 input.png -o public/img/hero-backdrop-desktop.webp
```

### 確認

置いたら `npm run dev` の画面をリロードするだけ。枠が画像に変わる。
変わらないときは **ファイル名のタイプミス**を疑う（`?prompts=1` の一覧で
チェックが付いていなければ、そのパスにファイルが無い）。

---

## 4. PC とモバイルで別カットが要る枠 / 要らない枠

**別カットが要る枠**（縦横比が大きく変わるので、同じ画像を切ると破綻する）

| スロット | PC | モバイル |
|---|---|---|
| `hero.backdrop` | 16:9 | 9:16 |
| `process.banner` | 5:1 | 4:5 |
| `contact.cta` | 16:9 | 4:5 |

**共用でよい枠**（正方形・4:3 のカードなので、`object-fit: cover` で両対応できる）

`hero.core` / `model.legacy` / `model.ai` / `flow.01`〜`04` /
`curriculum.01`〜`04` / `outcome.01`〜`04` / `team.backdrop` / `meta.ogp`

共用の枠はプロンプト画面の MOBILE タブが無効になっているので、迷わない。

---

## 5. 全カット一覧（20スロット / 23カット）

| スロット | 用途 | PC | SP |
|---|---|---|---|
| `hero.backdrop` | ファーストビュー全面 | 16:9 | 9:16 |
| `hero.core` | ヒーローのAIコア | 1:1 | 共用 |
| `model.legacy` | 従来の学習 | 4:3 | 共用 |
| `model.ai` | AI時代の学習 | 4:3 | 共用 |
| `flow.01`〜`flow.04` | 学習の流れ 4ステップ | 1:1 | 共用 |
| `curriculum.01`〜`04` | カリキュラム 4日程 | 4:3 | 共用 |
| `process.banner` | 7日間の光の帯 | 5:1 | 4:5 |
| `outcome.01`〜`04` | 7日後にできること | 1:1 | 共用 |
| `team.backdrop` | 講師陣の背景 | 21:9 | 共用 |
| `contact.cta` | 最後のCTA背景 | 16:9 | 4:5 |
| `meta.ogp` | SNSシェア用サムネ | 1.91:1 | 共用 |

---

## 6. 優先順位

全部いっぺんに作らなくてよい。効果の大きい順:

1. **`hero.backdrop`（PC / SP の2枚）** — 第一印象の9割。ここだけで印象が変わる
2. **`contact.cta`（PC / SP）** — 最後の締め。申し込み直前の感情を作る
3. **`curriculum.01`〜`04`** — 中身の説得力。4枚セットで効く
4. **`flow.01`〜`04`** — 学習の流れ
5. **`model.legacy` / `model.ai`** — before / after の対比。**この2枚は必ずセットで作る**
6. **`outcome.01`〜`04`** — できること
7. `hero.core` / `process.banner` / `team.backdrop` — 装飾。無くても成立する
8. `meta.ogp` — 作ったら `index.html` の `og:image` と `twitter:image` を
   `/img/meta-ogp-desktop.webp` に差し替える（ここだけ手作業が要る）

---

## 7. 注意

- **文字は画像に焼き込まない。** 見出し・本文は全部 HTML のまま。
  画像に文字を入れると、SEO・多言語・モバイルの折り返しが全部死ぬ。
  プロンプトにも「文字を入れるな」と明示してある
- **講師2名の顔写真は生成しない。** `public/sakamoto.jpg` / `public/numakura.jpg` の実写のまま。
  実在の人物なので生成画像に置き換えてはいけない
- 画像を追加したら `npm run build` して `dist/` も一緒にコミットする
  （このリポジトリは `dist/` を配信物としてコミットしている。README 参照）

---

## 8. プロンプトを1件ずつコピーできるページ

`docs/image-prompts.html` は、23カットぶんのプロンプトを**コピーボタン付きで1枚に並べた作業ページ**。
ブラウザで直接開ける（ビルド不要・オフラインでも動く）。

- カットごとに `プロンプトをコピー` / `パスをコピー`
- `23件まとめてコピー` / `未生成だけコピー`
- `生成済み` チェックはブラウザに保存されるので、続きから作業できる
- 絞り込み欄で `hero` `mobile` `カリキュラム` などで検索できる

このファイルは `content/imageSlots.ts` から生成した内容をそのまま持っている。
**プロンプトを直したら `content/imageSlots.ts` を直すのが正で**、
このページは古くなるので合わせて作り直すこと。
