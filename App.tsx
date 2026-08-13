import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StudioModel } from './components/StudioModel';
import { Process } from './components/Process';
import { Portfolio } from './components/Portfolio';
import { Team } from './components/Team';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FixedPageOverlay } from './components/FixedPageOverlay';
import { PromptConsole } from './components/PromptConsole';
import { PageType } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.None);

  const handleOpenPage = (page: PageType) => {
    setCurrentPage(page);
    // Disable background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleClosePage = () => {
    setCurrentPage(PageType.None);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="font-sans text-white bg-black selection:bg-brand-500 selection:text-black">
      <Navbar onOpenPage={handleOpenPage} />

      <main>
        <Hero />
        <StudioModel />
        <Portfolio />
        <Process />
        <Team />
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