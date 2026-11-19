import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Vite にバンドルさせてハッシュ付きURLで配信する。
// /showcase.css のような固定パスだと、キャッシュを壊す手段が無くなる
import './styles.css';
import './showcase.css';

// Google の書体の CSS を当てる（index.html で読み始めてある。JS を待たせないよう、ここで stylesheet にする）
const fonts = document.querySelector<HTMLLinkElement>('link[data-fonts]');
if (fonts) {
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = fonts.href;
  document.head.appendChild(sheet);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);