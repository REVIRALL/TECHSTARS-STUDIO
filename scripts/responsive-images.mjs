/**
 * 幅違いを出し分ける画像（content/imageSlots.ts で responsive を持つ物）を書き出す。
 *
 *   npm run img:responsive
 *
 * 元の大きな絵 assets-src/<名前>-master.webp から、widths の幅ごとに
 *   public/img/<名前>-<幅>w.avif（画質 60）と public/img/<名前>-<幅>w.webp（画質 82）
 * を作る。何度流しても同じ物ができる。
 *
 * ★2026-11-19 ヒーローの写真を 4K にした時に作った（ユーザー「画質悪いから４Kにして」「読み込み速度はあげて」）。
 *   画質は等倍で見比べて決めた：avif 45 は頬と服がのっぺりした。60 は元と見分けがつかない。
 *   重さの実測（ヒーロー PC）：3840 幅で avif 約 90KB・webp 約 140KB。前の 1536 幅 webp は 47KB。
 *   ふつうの PC（1440 幅・等倍）が読むのは 1600 幅の avif（約 35KB）で、前より軽い。
 *
 * 前の1枚だけの名前（<名前>.webp）は消す（画面からは参照しない）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AVIF_Q = 60;
const WEBP_Q = 82;

async function loadSlots() {
  const tmp = path.join(ROOT, 'node_modules', '.cache', 'imageSlots.responsive.mjs');
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  await esbuild.build({
    entryPoints: [path.join(ROOT, 'content', 'imageSlots.ts')],
    bundle: true,
    format: 'esm',
    outfile: tmp,
    logLevel: 'error',
  });
  return import(pathToFileURL(tmp).href + '?t=' + Date.now());
}

const { IMAGE_SLOTS } = await loadSlots();
let made = 0;
let missing = 0;

for (const slot of IMAGE_SLOTS) {
  for (const v of [slot.desktop, slot.mobile]) {
    if (!v?.responsive) continue;
    const name = path.basename(v.responsive.base); // hero-backdrop-desktop
    const master = path.join(ROOT, 'assets-src', `${name}-master.webp`);
    if (!fs.existsSync(master)) {
      console.error(`  ★元の絵が無い: assets-src/${name}-master.webp`);
      missing++;
      continue;
    }
    const meta = await sharp(master).metadata();
    for (const w of v.responsive.widths) {
      if (w > meta.width) {
        console.error(`  ★${name}: 元の絵（${meta.width}px）より大きい幅 ${w} は作らない`);
        missing++;
        continue;
      }
      const base = sharp(master).resize({ width: w, kernel: 'lanczos3' });
      const avif = path.join(ROOT, 'public', 'img', `${name}-${w}w.avif`);
      const webp = path.join(ROOT, 'public', 'img', `${name}-${w}w.webp`);
      await base.clone().avif({ quality: AVIF_Q, effort: 6 }).toFile(avif);
      await base.clone().webp({ quality: WEBP_Q, effort: 6, smartSubsample: true }).toFile(webp);
      made++;
      console.log(
        `  ${name}-${w}w  avif ${(fs.statSync(avif).size / 1024).toFixed(0).padStart(4)}KB  webp ${(fs.statSync(webp).size / 1024).toFixed(0).padStart(4)}KB`
      );
    }
    const old = path.join(ROOT, 'public', 'img', `${name}.webp`);
    if (fs.existsSync(old)) {
      fs.rmSync(old);
      console.log(`  前の1枚 ${name}.webp を消した`);
    }
  }
}

console.log(`\n  ${made} 幅を書き出し`);
if (missing) {
  console.error(`合否: 不合格（${missing} 件）`);
  process.exit(1);
}
console.log('合否: 合格');
