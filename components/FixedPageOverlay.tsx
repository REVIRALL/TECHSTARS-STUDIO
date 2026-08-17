import React, { useEffect, useRef } from 'react';
import { PageType } from '../types';
import { X, ExternalLink } from 'lucide-react';
import {
  FaqContent,
  PricingContent,
  PrivacyContent,
  TermsContent,
  TokushohoContent,
} from './pages/PageContents';
import { routeByKey } from '../content/site';

interface FixedPageOverlayProps {
  page: PageType;
  onClose: () => void;
}

/**
 * トップページ上に被せる詳細ページ。
 *
 * 本文は components/pages/PageContents.tsx と共有していて、
 * 同じ内容が /pricing/ /faq/ /privacy/ /terms/ /tokushoho/ という
 * 実URLの静的ページとしても配信される（そちらがクロール対象）。
 * ここはあくまで「トップを離れずに読める」ためのUX。
 */

const CONTENT: Record<
  Exclude<PageType, PageType.None>,
  { Body: React.FC<{ level?: 1 | 2 }>; routeKey: 'pricing' | 'faq' | 'privacy' | 'terms' | 'tokushoho' }
> = {
  [PageType.Company]: { Body: PricingContent, routeKey: 'pricing' },
  [PageType.FAQ]: { Body: FaqContent, routeKey: 'faq' },
  [PageType.Privacy]: { Body: PrivacyContent, routeKey: 'privacy' },
  [PageType.Terms]: { Body: TermsContent, routeKey: 'terms' },
  [PageType.Tokushoho]: { Body: TokushohoContent, routeKey: 'tokushoho' },
};

export const FixedPageOverlay: React.FC<FixedPageOverlayProps> = ({ page, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  // [ESC] 閉じる と書いてあるのに ESC が効かない、という状態を解消する
  useEffect(() => {
    if (page === PageType.None) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [page, onClose]);

  if (page === PageType.None) return null;

  const entry = CONTENT[page as Exclude<PageType, PageType.None>];
  if (!entry) return null;

  const { Body, routeKey } = entry;
  const route = routeByKey(routeKey);
  const isDarkPage = routeKey === 'privacy' || routeKey === 'terms' || routeKey === 'tokushoho';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={route.breadcrumb}
      className={`fixed inset-0 z-[100] ${
        isDarkPage ? 'bg-black text-slate-300' : 'bg-slate-50 text-black'
      } overflow-y-auto animate-fade-in no-scrollbar`}
    >
      <div
        className={`fixed top-0 left-0 w-full px-6 lg:px-12 py-4 flex justify-between items-center ${
          isDarkPage ? 'bg-black/95 border-slate-800' : 'bg-white/95 border-slate-200'
        } border-b z-50`}
      >
        <div className="flex items-center gap-4">
          <span
            className={`flex flex-col items-center justify-center w-8 h-8 border ${
              isDarkPage ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-100'
            }`}
            aria-hidden="true"
          >
            <span className="font-mono text-[10px] font-bold">ID</span>
          </span>
          <div>
            <span className="block font-black text-lg tracking-tighter leading-none">{route.breadcrumb}</span>
            {/* オーバーレイで読んでいる内容にも固有URLがあることを示す。共有もできる */}
            <a
              href={route.path}
              className="inline-flex items-center gap-1 font-mono text-[10px] text-brand-500 tracking-widest hover:underline"
            >
              {route.path} <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
            </a>
          </div>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="group flex items-center gap-3 text-sm font-bold hover:text-brand-500 transition-colors"
        >
          <span className="font-mono text-xs hidden md:inline-block opacity-50 group-hover:opacity-100">
            [ESC] 閉じる
          </span>
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all group-hover:rotate-90 ${
              isDarkPage ? 'bg-slate-800 text-white' : 'bg-black text-white'
            } group-hover:bg-brand-500 group-hover:text-black`}
          >
            <X size={16} aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-20">
        <Body level={2} />
      </div>
    </div>
  );
};
