import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { getSlot, srcsetOf } from './content/imageSlots';
import { withImgVersion } from './content/imgVersion';

/**
 * 最初の画面の写真を、HTML を読んだ時点で読み始めさせる（★2026-11-19「読み込み速度はあげて」）。
 * この LP は JS が動いてから画面を作るので、何もしないと写真の読み込みは JS を読み切った後に始まる。
 * 画面で使う srcset・sizes と同じ物（content/imageSlots.ts の hero.backdrop）を出すので、二重には読まない。
 * avif を読めないブラウザは type で飛ばし、画面の webp を普通に読む。
 *
 * ★PC（768px〜）だけ。スマホは写真が画面いっぱいの背景で、ブラウザの「いちばん大きく描いた物（LCP）」に数えられず、
 *   見出しの字が LCP になる。スマホで写真を先に強く読ませると、見出しを描く JS と回線を取り合って遅くなった
 *   （手元の Lighthouse スマホ LCP 3.7 秒 → 6.1 秒。PC は 1.9 秒 → 1.3 秒に速くなった）。
 */
function heroPreload(): Plugin {
  return {
    name: 'hero-preload',
    transformIndexHtml(html) {
      const hero = getSlot('hero.backdrop');
      const pc = hero?.desktop.responsive;
      if (!pc) throw new Error('hero.backdrop に幅違い（responsive）が無い');
      const tags = `<link rel="preload" as="image" type="image/avif" fetchpriority="high" media="(min-width: 768px)" imagesrcset="${srcsetOf(pc, 'avif', withImgVersion)}" imagesizes="${pc.sizes}">`;
      const marker = '<!-- hero-preload（vite.config.ts が最初の画面の写真の先読みをここに入れる） -->';
      if (!html.includes(marker)) throw new Error('index.html に hero-preload の印が無い');
      return html.replace(marker, tags);
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // ★ここで渡した値は minify 後のバンドルに literal で焼き込まれ、ブラウザから素で読める。
    // このリポジトリは public かつ dist/ をコミットしているため、実キーのままビルドすると
    // 「公開リポジトリ」と「配信中のJS」の両方に鍵が載る。事故が静かに起きるので既定で抑止する。
    // どうしても埋め込む場合のみ ALLOW_INLINE_API_KEY=1 を明示すること（非推奨）。
    // 正しい直し方は、鍵をサーバ側（Netlify Functions 等）に置いてプロキシすること。
    const rawKey = env.GEMINI_API_KEY ?? '';
    const isHarmless = rawKey === '' || rawKey === 'PLACEHOLDER_API_KEY';
    const allowInline = process.env.ALLOW_INLINE_API_KEY === '1';
    const inlineKey = isHarmless || allowInline ? rawKey : '';

    if (!isHarmless && !allowInline) {
      console.warn(
        '\n[security] GEMINI_API_KEY を検出しましたが、バンドルへの埋め込みを抑止しました。\n' +
        '           クライアントに焼き込むと公開されます。AI機能は無効のままビルドします。\n' +
        '           意図的に埋め込むなら ALLOW_INLINE_API_KEY=1 を付けて実行してください。\n'
      );
    }

    return {
      server: {
        port: 3000,
        // ★0.0.0.0 にしない。同一LANの第三者が開発サーバに到達でき、
        //   .env.local を読んだ未minifyのバンドル（鍵を含みうる）が配られる。
        //   実機確認が要るときだけ `npm run dev -- --host` を明示する。
        host: '127.0.0.1',
      },
      plugins: [react(), heroPreload()],
      define: {
        'process.env.API_KEY': JSON.stringify(inlineKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(inlineKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
