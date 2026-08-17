/**
 * 静的アセットの生成（ファビコン / OGP / 講師写真 / manifest）
 * ============================================================================
 *   npm run assets
 *
 * 生成物は public/ に置くので、Vite が dist/ へそのままコピーする。
 * 冪等。すでに最新なら何もしない（--force で作り直す）。
 *
 * ここで直している問題:
 *   - 698x626 の logo.png（60KB）をそのままファビコンにしていた
 *   - og:image が相対パスの logo.png（正方形）で、SNSで正しく展開されなかった
 *   - 講師写真が 1150x1424 / 178KB の生JPEGのまま配信されていた
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const IMG = path.join(PUB, 'img');
/** 配信しない原本の置き場。ここにあるものは dist/ には出ない */
const SRC_MEDIA = path.join(ROOT, 'media');
const FORCE = process.argv.includes('--force');

const rel = (p) => path.relative(ROOT, p);
const fresh = (out, src) =>
  !FORCE &&
  fs.existsSync(out) &&
  fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;

async function write(out, src, build) {
  if (fresh(out, src)) return;
  await build();
  const kb = (fs.statSync(out).size / 1024).toFixed(1);
  console.log(`  ✓ ${rel(out)}  (${kb}KB)`);
}

/**
 * PNG を内包した .ico を組み立てる。
 * Vista 以降の ICO は PNG をそのまま格納でき、ヘッダは 22 バイトで済む。
 * これだけのために ico エンコーダを依存に足す必要はない。
 */
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // 画像1枚
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // パレット無し
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12); // データ開始位置
  return Buffer.concat([header, entry, png]);
}

async function main() {
  const logo = path.join(PUB, 'logo.png');
  console.log('\n静的アセットを生成中…');

  /* ── ファビコン ─────────────────────────────── */
  // 黒背景に合成する。透過PNGのままだとタブによっては黒アイコンが黒地に沈む
  const square = (size) =>
    sharp(logo)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .flatten({ background: '#000000' })
      .png({ compressionLevel: 9, palette: true });

  await write(path.join(PUB, 'favicon-192.png'), logo, async () => {
    await square(192).toFile(path.join(PUB, 'favicon-192.png'));
  });

  await write(path.join(PUB, 'favicon-512.png'), logo, async () => {
    await square(512).toFile(path.join(PUB, 'favicon-512.png'));
  });

  await write(path.join(PUB, 'apple-touch-icon.png'), logo, async () => {
    await square(180).toFile(path.join(PUB, 'apple-touch-icon.png'));
  });

  await write(path.join(PUB, 'favicon.ico'), logo, async () => {
    const png = await square(32).toBuffer();
    fs.writeFileSync(path.join(PUB, 'favicon.ico'), icoFromPng(png, 32));
  });

  /* ── OGP ─────────────────────────────────────── */
  // WebP を読めないSNSクローラーがまだいるので、配信の正はJPEGにする
  const ogpSrc = path.join(IMG, 'meta-ogp-desktop.webp');
  if (fs.existsSync(ogpSrc)) {
    await write(path.join(IMG, 'ogp.jpg'), ogpSrc, async () => {
      await sharp(ogpSrc)
        .resize(1200, 630, { fit: 'cover' })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(path.join(IMG, 'ogp.jpg'));
    });
  } else {
    console.warn(`  ! ${rel(ogpSrc)} が無い。og:image が生成できない`);
  }

  /* ── 講師写真 ────────────────────────────────── */
  // 原寸（1150x1424 / 178KB）は media/ に置いてあり、配信対象ではない。
  // ここで 800px 幅の webp / jpg に落としたものだけを public/img/ へ出す
  for (const name of ['sakamoto', 'numakura']) {
    const src = path.join(SRC_MEDIA, `${name}.jpg`);
    if (!fs.existsSync(src)) continue;

    await write(path.join(IMG, `${name}.webp`), src, async () => {
      await sharp(src).resize({ width: 800 }).webp({ quality: 78 }).toFile(path.join(IMG, `${name}.webp`));
    });

    await write(path.join(IMG, `${name}.jpg`), src, async () => {
      await sharp(src)
        .resize({ width: 800 })
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(path.join(IMG, `${name}.jpg`));
    });
  }

  /* ── 生成済み画像の一覧 ──────────────────────── */
  /**
   * public/img/ に実在するファイルを content/generatedImages.ts に書き出す。
   *
   * これが無いと、未生成のスロットについて「まず読みに行って404を受けてから
   * プレースホルダーに落ちる」ことになり、毎回の表示で無駄な404が出ていた
   * （icon.legacy / icon.ai / icon.client / icon.community の4件）。
   * 一覧を持てば最初から正しい方を描ける。
   *
   * 画像を足したときは npm run build（先頭で npm run assets が走る）で
   * 自動的に更新されるので、運用手順は「public/img に置くだけ」のまま変わらない。
   */
  const files = fs.existsSync(IMG) ? fs.readdirSync(IMG).sort() : [];
  const manifestTs =
    `/**\n` +
    ` * 自動生成ファイル — 直接編集しない\n` +
    ` * 生成元: scripts/gen-assets.mjs（public/img/ の実ファイルを走査）\n` +
    ` * 更新: npm run assets\n` +
    ` */\n\n` +
    `export const GENERATED_IMAGES: ReadonlySet<string> = new Set([\n` +
    files.map((f) => `  '/img/${f}',`).join('\n') +
    `\n]);\n\n` +
    `/** そのパスの画像がすでに用意されているか */\n` +
    `export const hasImage = (src: string): boolean => GENERATED_IMAGES.has(src);\n`;

  const manifestPath = path.join(ROOT, 'content', 'generatedImages.ts');
  const prev = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, 'utf8') : '';
  if (prev !== manifestTs) {
    fs.writeFileSync(manifestPath, manifestTs);
    console.log(`  ✓ ${rel(manifestPath)}  (${files.length}ファイル)`);
  }

  /* ── manifest ────────────────────────────────── */
  const manifest = {
    name: 'TECHSTARS STUDIO — AI開発スクール',
    short_name: 'TECHSTARS',
    description: '7日間で動くシステムを3つ作るAI開発スクール。',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    lang: 'ja',
    icons: [
      { src: '/favicon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
  fs.writeFileSync(path.join(PUB, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`  ✓ ${rel(path.join(PUB, 'site.webmanifest'))}`);

  console.log('完了\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
