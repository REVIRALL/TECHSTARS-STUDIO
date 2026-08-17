import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { StandalonePage } from './components/StandalonePage';
import { headFor } from './content/seo';
import { RouteMeta, ROUTES } from './content/site';

/**
 * プリレンダリング用のエントリ。
 * `vite build --ssr` でビルドされ、scripts/prerender.mjs から呼ばれる。
 * ブラウザには一切送られないので、ここに何を書いてもバンドルは太らない。
 */

export { ROUTES } from './content/site';
export { ORIGIN, BUILD_DATE, BUILD_DAY, FAQS, COURSE, ORG, INSTRUCTORS } from './content/site';

export interface Rendered {
  route: RouteMeta;
  head: string;
  html: string;
}

export function renderRoute(route: RouteMeta, assetTags: string): Rendered {
  const html = renderToString(
    route.key === 'home' ? <App /> : <StandalonePage route={route} />
  );
  return { route, head: headFor(route, assetTags), html };
}

export function renderAll(assetTags: string): Rendered[] {
  return ROUTES.map((r) => renderRoute(r, assetTags));
}
