import React from 'react';
import { PageType } from '../types';
import { routeByKey, RouteKey } from '../content/site';

/**
 * 詳細ページへのリンク。
 *
 * 常に本物の <a href="/faq/"> として出力する。これが重要で、
 *  - クローラーは href を辿るのでインデックスされる
 *  - 中クリック / 新規タブ / URL共有 が普通に効く
 *  - JSが落ちても到達できる
 *
 * トップページ上では onOpenPage が渡され、クリックを横取りして
 * 従来どおりオーバーレイで開く。単独ページ上では渡されないので、
 * そのまま通常の遷移になる（プログレッシブエンハンスメント）。
 */

const PAGE_BY_ROUTE: Record<string, PageType> = {
  pricing: PageType.Company,
  faq: PageType.FAQ,
  privacy: PageType.Privacy,
  terms: PageType.Terms,
  tokushoho: PageType.Tokushoho,
};

interface PageLinkProps {
  route: Extract<RouteKey, 'pricing' | 'faq' | 'privacy' | 'terms' | 'tokushoho'>;
  onOpenPage?: (page: PageType) => void;
  className?: string;
  children: React.ReactNode;
}

export const PageLink: React.FC<PageLinkProps> = ({ route, onOpenPage, className = '', children }) => {
  const meta = routeByKey(route);

  return (
    <a
      href={meta.path}
      className={className}
      onClick={(e) => {
        // 修飾キー付き・中クリックは通常のブラウザ挙動に任せる
        if (!onOpenPage || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onOpenPage(PAGE_BY_ROUTE[route]);
      }}
    >
      {children}
    </a>
  );
};
