import React, { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StudioModel } from './components/StudioModel';
import { Process } from './components/Process';
import { Portfolio } from './components/Portfolio';
import { Team } from './components/Team';
import { Faq } from './components/Faq';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FixedPageOverlay } from './components/FixedPageOverlay';
import { PromptConsole } from './components/PromptConsole';
import { PageType } from './types';
import { routeByKey } from './content/site';

/** オーバーレイで開いているページと、対応する実URL */
const PATH_FOR_PAGE: Partial<Record<PageType, string>> = {
  [PageType.Company]: routeByKey('pricing').path,
  [PageType.FAQ]: routeByKey('faq').path,
  [PageType.Privacy]: routeByKey('privacy').path,
  [PageType.Terms]: routeByKey('terms').path,
  [PageType.Tokushoho]: routeByKey('tokushoho').path,
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.None);

  const handleOpenPage = useCallback((page: PageType) => {
    setCurrentPage(page);
    document.body.style.overflow = 'hidden';
    // オーバーレイで読んでいる内容にもURLを与える。共有・再読み込み・戻るが期待どおり動く
    const path = PATH_FOR_PAGE[page];
    if (path) window.history.pushState({ overlay: page }, '', path);
  }, []);

  const handleClosePage = useCallback(() => {
    setCurrentPage(PageType.None);
    document.body.style.overflow = '';
    if (window.history.state?.overlay) window.history.back();
  }, []);

  // ブラウザバックでオーバーレイを閉じる
  useEffect(() => {
    const onPop = () => {
      setCurrentPage(PageType.None);
      document.body.style.overflow = '';
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <div className="font-sans text-white bg-black selection:bg-brand-500 selection:text-black">
      <a
        href="#main"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-brand-500 focus:text-black focus:px-4 focus:py-2 focus:font-bold"
      >
        本文へスキップ
      </a>

      <Navbar onOpenPage={handleOpenPage} />

      <main id="main">
        <Hero />
        <StudioModel />
        <Portfolio />
        <Process />
        <Team />
        <Faq onOpenPage={handleOpenPage} />
        <Contact />
      </main>

      <Footer onOpenPage={handleOpenPage} />

      <FixedPageOverlay page={currentPage} onClose={handleClosePage} />

      {/* 画面全体のフィルムグレイン。画像とCSSの質感を一枚の膜で揃える */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* 画像生成プロンプトの作業台。?prompts=1 または Ctrl/Cmd + Shift + I で開く */}
      <PromptConsole />
    </div>
  );
};

export default App;
