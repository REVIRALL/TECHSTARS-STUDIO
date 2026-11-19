import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StudioModel } from './components/StudioModel';
import { Portfolio } from './components/Portfolio';
import { Team } from './components/Team';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FixedPageOverlay } from './components/FixedPageOverlay';
import { CheckoutResult, CheckoutOutcome } from './components/CheckoutResult';
import { PromptConsole } from './components/PromptConsole';
import { PageType } from './types';

/**
 * 決済の戻り先だけ、オーバーレイではなく実URLのページにしている。
 * Stripe の after_completion は実在するURLを要求するため。
 * Netlify の SPA フォールバック（netlify.toml と public/_redirects）で
 * /checkout/* も index.html が返るので、ここでパスを見て出し分ける。
 *
 * ★/checkout/thanks は Payment Link の after_completion から実際に飛んでくる。
 * ★/checkout/cancel は **現状 Stripe からは飛んでこない**。
 *   Payment Link に cancel_url は存在しない（API実測：`Received unknown parameter: cancel_url`、
 *   対照として active=true は通るので拒否はこの項目固有）。
 *   中断した利用者は Stripe のホスト画面の戻るでブラウザ履歴を遡るだけになる。
 *   このページを残しているのは、将来 Checkout Session 方式（cancel_url あり）へ移すときに
 *   そのまま使えるようにするため。それまでは直リンクでのみ到達する。
 */
const resolveCheckoutOutcome = (): CheckoutOutcome | null => {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/checkout/thanks') return 'thanks';
  if (path === '/checkout/cancel') return 'cancel';
  return null;
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.None);
  const checkoutOutcome = resolveCheckoutOutcome();

  const handleOpenPage = (page: PageType) => {
    setCurrentPage(page);
    // Disable background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleClosePage = () => {
    setCurrentPage(PageType.None);
    document.body.style.overflow = 'auto';
  };

  if (checkoutOutcome) {
    return (
      <div className="font-sans text-ink bg-white selection:bg-brand-200 selection:text-ink">
        <CheckoutResult outcome={checkoutOutcome} onOpenPage={handleOpenPage} />
        <FixedPageOverlay page={currentPage} onClose={handleClosePage} onOpenPage={handleOpenPage} />
      </div>
    );
  }

  return (
    <div className="font-sans text-ink bg-white selection:bg-brand-200 selection:text-ink">
      <Navbar onOpenPage={handleOpenPage} />

      <main>
        <Hero />
        <StudioModel />
        {/* ★2026-11-17 fix-copy #8：7日間の説明を「カリキュラム」の1区画の表にまとめ、学習スケジュール（Process）は外した */}
        <Portfolio />
        {/* ★2026-11-19 料金プランはページに置かない（ユーザー「index.htmlには出ないように」）。
            ヘッダーの「料金プラン」「お申し込み」で開くポップアップ（FixedPageOverlay の Pricing）の中だけで出す */}
        <Team />
        <Contact />
      </main>

      <Footer onOpenPage={handleOpenPage} />

      <FixedPageOverlay page={currentPage} onClose={handleClosePage} onOpenPage={handleOpenPage} />

      {/* ★2026-11-16 明るい版にしたので、暗い画面に掛けていたフィルムの粒の膜（grain-overlay）は外した */}

      {/* 画像生成プロンプトの作業台。?prompts=1 または Ctrl/Cmd + Shift + I で開く */}
      <PromptConsole />
    </div>
  );
};

export default App;
