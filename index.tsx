import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { StandalonePage } from './components/StandalonePage';
import { routeForPath } from './content/site';
// Vite にバンドルさせてハッシュ付きURLで配信する。
// /showcase.css のような固定パスだと、キャッシュを壊す手段が無くなる
import './showcase.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const route = routeForPath(window.location.pathname);
const tree = (
  <React.StrictMode>{route.key === 'home' ? <App /> : <StandalonePage route={route} />}</React.StrictMode>
);

/**
 * ビルド時に静的HTMLを焼き込んである（scripts/prerender.mjs）。
 * 中身があるならハイドレーション、無ければ通常のマウントにフォールバックする。
 * ハイドレーションなら初期表示のDOMを作り直さないので、LCPとCLSが素直に良くなる。
 */
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, tree);
} else {
  createRoot(rootElement).render(tree);
}
