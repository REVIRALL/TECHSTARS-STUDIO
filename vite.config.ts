import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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
      plugins: [react()],
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
