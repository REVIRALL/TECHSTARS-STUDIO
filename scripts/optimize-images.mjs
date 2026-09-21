/**
 * public/img/ の画像を「実際に表示されるサイズ」まで縮めて再圧縮する。
 *
 *   npm run img
 *
 * 縮小の基準は content/imageSlots.ts の deliverWidth。
 * これは実ブラウザでレイアウト上の表示幅を実測し、Retina 用に2倍した値。
 * 画像生成AIの出力はどうしても表示サイズより大きくなるので、
 * 置いたあと一度これを通す。何度流しても結果は同じ（冪等）。
 *
 * 元画像を残しておきたい場合は public/img/ ではなく別の場所に置くこと。
 * このスクリプトは public/img/ の中身を直接書き換える。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = path.join(ROOT, 'public', 'img');
const QUALITY = 78; // 暗部とヘイズ主体の絵なので、この辺りまでは目視で劣化が出ない

// imageSlots.ts は TypeScript なので、esbuild で一度 JS にしてから読む
async function loadSlots() {
  const tmp = path.join(ROOT, 'node_modules', '.cache', 'imageSlots.mjs');
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  await esbuild.build({
    entryPoints: [path.join(ROOT, 'content', 'imageSlots.ts')],
    bundle: true,
    format: 'esm',
    outfile: tmp,
    logLevel: 'error',
  });
  return import(tmp + '?t=' + Date.now());
}

const { IMAGE_SLOTS } = await loadSlots();

/** 配信ファイル名 → 上限幅 */
const limits = new Map();
for (const slot of IMAGE_SLOTS) {
  for (const v of [slot.desktop, slot.mobile]) {
    if (v) limits.set(path.basename(v.src), v.deliverWidth);
  }
}

let before = 0;
let after = 0;
let touched = 0;
const skipped = [];

for (const [name, limit] of [...limits].sort()) {
  const file = path.join(IMG_DIR, name);
  if (!fs.existsSync(file)) {
    skipped.push(name);
    continue;
  }

  const src = fs.readFileSync(file);
  const meta = await sharp(src).metadata();
  before += src.length;

  let pipeline = sharp(src);
  if (meta.width > limit) {
    pipeline = pipeline.resize({ width: limit, withoutEnlargement: true, kernel: 'lanczos3' });
  }
  const out = await pipeline.webp({ quality: QUALITY, effort: 6, smartSubsample: true }).toBuffer();

  // 大きくなるだけなら書き換えない
  if (out.length >= src.length) {
    after += src.length;
    console.log(
      `  keep   ${name.padEnd(30)} ${String(meta.width).padStart(5)}px ` +
        `${(src.length / 1024).toFixed(0).padStart(5)}KB`
    );
    continue;
  }

  const outMeta = await sharp(out).metadata();
  fs.writeFileSync(file, out);
  after += out.length;
  touched++;
  console.log(
    `  write  ${name.padEnd(30)} ${String(meta.width).padStart(5)}px -> ${String(outMeta.width).padStart(5)}px  ` +
      `${(src.length / 1024).toFixed(0).padStart(5)}KB -> ${(out.length / 1024).toFixed(0).padStart(5)}KB`
  );
}

const kb = (n) => (n / 1024).toFixed(0);
console.log('');
console.log(`  ${touched} 枚を書き換え / ${limits.size - skipped.length} 枚を確認`);
console.log(`  合計 ${kb(before)}KB -> ${kb(after)}KB  (${(100 - (after / before) * 100).toFixed(1)}% 削減)`);
if (skipped.length) console.log(`  未生成 ${skipped.length} 枚: ${skipped.join(', ')}`);
