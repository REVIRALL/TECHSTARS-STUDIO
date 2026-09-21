import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StudioModel } from './components/StudioModel';
import { Process } from './components/Process';
import { Portfolio } from './components/Portfolio';
import { Pricing } from './components/Pricing';
import { Team } from './components/Team';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FixedPageOverlay } from './components/FixedPageOverlay';
import { CheckoutResult, CheckoutOutcome } from './components/CheckoutResult';
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
      <div className="font-sans text-white bg-black selection:bg-brand-500 selection:text-black">
        <CheckoutResult outcome={checkoutOutcome} onOpenPage={handleOpenPage} />
        <FixedPageOverlay page={currentPage} onClose={handleClosePage} />
      </div>
    );
  }

  return (
    <div className="font-sans text-white bg-black selection:bg-brand-500 selection:text-black">
      <Navbar onOpenPage={handleOpenPage} />

      <main>
        <Hero />
        <StudioModel />
        <Portfolio />
        <Process />
        <Pricing onOpenPage={handleOpenPage} />
        <Team />
        <Contact />
      </main>

      <Footer onOpenPage={handleOpenPage} />

      <FixedPageOverlay page={currentPage} onClose={handleClosePage} />
    </div>
  );
};

export default App;
