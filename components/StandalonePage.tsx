import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Footer } from './Footer';
import {
  FaqContent,
  PricingContent,
  PrivacyContent,
  TermsContent,
  TokushohoContent,
} from './pages/PageContents';
import { COURSE, ORG, RouteMeta } from '../content/site';

/**
 * 実URLを持つ単独ページ（/pricing/ /faq/ /privacy/ /terms/ /tokushoho/ と 404）。
 *
 * 本文はトップのオーバーレイと同じコンポーネントを共有している。
 * 違うのは外側だけ:
 *   - 単独ページなので見出しは h1 から始まる（level=1）
 *   - パンくずがある（JSON-LD の BreadcrumbList と対応）
 *   - フッターが付き、サイト内の他のページへ辿れる
 */

const BODY: Record<string, React.FC<{ level?: 1 | 2 }>> = {
  pricing: PricingContent,
  faq: FaqContent,
  privacy: PrivacyContent,
  terms: TermsContent,
  tokushoho: TokushohoContent,
};

const LIGHT = new Set(['pricing', 'faq']);

const NotFound: React.FC = () => (
  <div className="max-w-2xl">
    <p className="font-mono text-xs text-brand-500 tracking-widest mb-4">// ERROR 404</p>
    <h1 className="text-4xl md:text-6xl font-black jp-display text-white mb-6">
      ページが
      <br />
      見つかりません
    </h1>
    <p className="text-slate-400 leading-relaxed mb-10">
      お探しのページは移動または削除された可能性があります。
      <br />
      下のリンクから目的の情報にたどり着けます。
    </p>
    <ul className="space-y-3 font-mono text-sm">
      <li>
        <a href="/" className="text-brand-500 hover:underline underline-offset-4">
          / — トップページ（{COURSE.shortName}の概要）
        </a>
      </li>
      <li>
        <a href="/pricing/" className="text-brand-500 hover:underline underline-offset-4">
          /pricing/ — 料金プラン
        </a>
      </li>
      <li>
        <a href="/faq/" className="text-brand-500 hover:underline underline-offset-4">
          /faq/ — よくある質問
        </a>
      </li>
    </ul>
  </div>
);

export const StandalonePage: React.FC<{ route: RouteMeta }> = ({ route }) => {
  const Body = BODY[route.key];
  const light = LIGHT.has(route.key);

  return (
    <div className="font-sans bg-black text-white min-h-screen flex flex-col">
      <a
        href="#main"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-brand-500 focus:text-black focus:px-4 focus:py-2 focus:font-bold"
      >
        本文へスキップ
      </a>

      <header className="border-b border-slate-800 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3 shrink-0">
            <img src="/logo.png" alt="" aria-hidden="true" width={40} height={40} className="h-8 md:h-10 w-auto" />
            <span className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="font-black text-white text-sm md:text-base tracking-tight">TECHSTARS</span>
              <span className="font-mono text-brand-500 text-[10px] md:text-xs tracking-widest">STUDIO</span>
            </span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-brand-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            トップに戻る
          </a>
        </div>
      </header>

      <nav aria-label="パンくずリスト" className="border-b border-slate-900 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-3">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-500">
            <li>
              <a href="/" className="hover:text-brand-500 transition-colors">
                ホーム
              </a>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3 h-3" />
            </li>
            <li className="text-slate-300" aria-current="page">
              {route.breadcrumb}
            </li>
          </ol>
        </div>
      </nav>

      <main id="main" className={`flex-1 ${light ? 'bg-slate-50 text-black' : 'bg-black text-slate-300'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          {Body ? <Body level={1} /> : <NotFound />}
        </div>
      </main>

      {/* 会社の実体をどのページからも取れるようにしておく。E-E-A-T の土台 */}
      <section aria-label="運営者情報" className="bg-black border-t border-slate-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
          <h2 className="font-mono text-xs text-brand-500 tracking-widest mb-4">// 運営者情報</h2>
          <address className="not-italic text-sm text-slate-400 leading-relaxed">
            {ORG.legalName}（{ORG.brand}）
            <br />
            {ORG.address}
            <br />
            TEL:{' '}
            <a href={ORG.telUri} className="hover:text-brand-500 underline underline-offset-4">
              {ORG.tel}
            </a>
            {' / '}
            Email:{' '}
            <a href={`mailto:${ORG.email}`} className="hover:text-brand-500 underline underline-offset-4">
              {ORG.email}
            </a>
          </address>
        </div>
      </section>

      <Footer />
    </div>
  );
};
