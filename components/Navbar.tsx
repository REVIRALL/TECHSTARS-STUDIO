import React, { useState, useEffect } from 'react';
import { SectionId, PageType } from '../types';
import { GenIcon } from './GenIcon';

interface NavbarProps {
  onOpenPage: (page: PageType) => void;
}

/**
 * ヘッダー。
 * ★2026-11-16 明るい版。見た目の正本は designs/lp-stats/variants/2-section-fv/v2.png の上の帯
 *  （白い地に濃紺の字のメニュー・白い角丸のボタン「お申し込み」・水色の枠のボタン「受講生」）。
 *  ロゴは今の正規の物（/logo.png）をそのまま使う（ユーザー「ロゴは正規の今のやつ活用して。」）。
 *  メニューの項目の間に引いていた縦の区切り線は外した（飾りの線を引かない）。
 *  6項目＋ボタン2つが 1024px 未満では入り切らないので、PC のメニューは lg（1024px）から。
 */
export const Navbar: React.FC<NavbarProps> = ({ onOpenPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 開いている間は後ろの本文を動かさない。Esc で閉じる
  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: '学習の流れ', href: `#${SectionId.Model}` },
    { label: 'カリキュラム', href: `#${SectionId.Portfolio}` },
    { label: '料金プラン', href: `#${SectionId.Pricing}` },
    { label: '講師陣', href: `#${SectionId.Team}` },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-[background-color,box-shadow,padding] duration-300 ${
          isScrolled || isMenuOpen
            ? 'bg-white shadow-[0_6px_24px_-12px_rgba(11,27,46,0.18)] py-2.5'
            : 'bg-transparent py-4 lg:py-6'
        }`}
        aria-label="メインナビゲーション"
      >
        <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 flex justify-between items-center gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 md:gap-3 group z-50 shrink-0 min-h-[44px]">
            <img
              src="/logo.png"
              alt="TechStars"
              width={698}
              height={626}
              className="h-10 lg:h-12 w-auto group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <span className="font-black text-ink text-[15px] sm:text-lg lg:text-[22px] tracking-tight">TECHSTARS</span>
              <span className="font-black text-brand-700 text-[15px] sm:text-lg lg:text-[22px] tracking-tight">AI</span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <div className="flex items-center">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-2.5 xl:px-4 py-3 text-sm xl:text-[15px] font-bold text-ink hover:text-brand-700 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => onOpenPage(PageType.Company)}
                className="px-2.5 xl:px-4 py-3 text-sm xl:text-[15px] font-bold text-ink hover:text-brand-700 transition-colors whitespace-nowrap"
              >
                詳細
              </button>
              <button
                onClick={() => onOpenPage(PageType.FAQ)}
                className="px-2.5 xl:px-4 py-3 text-sm xl:text-[15px] font-bold text-ink hover:text-brand-700 transition-colors whitespace-nowrap"
              >
                FAQ
              </button>
            </div>

            <a
              href={`#${SectionId.Pricing}`}
              className="ml-2 inline-flex items-center justify-center min-h-[48px] px-6 xl:px-8 rounded-xl bg-white text-ink font-black text-sm xl:text-base shadow-card hover:shadow-lift hover:text-brand-700 transition-[box-shadow,color] duration-300 whitespace-nowrap"
            >
              お申し込み
            </a>
            <a
              href="https://lms.techstars.studio/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[48px] px-6 xl:px-9 rounded-xl border-2 border-brand-500 bg-white/70 text-brand-700 font-black text-sm xl:text-base hover:bg-brand-500 hover:text-ink transition-colors duration-300 whitespace-nowrap"
            >
              受講生
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl text-ink bg-white/80 shadow-card z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <GenIcon name={isMenuOpen ? 'close' : 'menu'} className="w-7 h-7" eager />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay。白い地・濃紺の大きな字（区切りの線は引かない）。
          ★2026-11-17 項目の前の等幅の番号「01」〜「04」は外した（意味の無い番号。依頼主「こういうのが全部AIっぽい」） */}
      {isMenuOpen && (
        <div id="mobile-menu" className="fixed inset-0 bg-white z-[45] flex flex-col pt-24 pb-10 px-6 overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-2xl sm:text-3xl font-black jp-display text-ink py-3.5 hover:text-brand-700 transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setIsMenuOpen(false); onOpenPage(PageType.Company); }}
            className="text-left text-xl sm:text-2xl font-black jp-display text-ink-soft py-3.5 hover:text-brand-700"
          >
             プログラム詳細
          </button>
           <button
            onClick={() => { setIsMenuOpen(false); onOpenPage(PageType.FAQ); }}
            className="text-left text-xl sm:text-2xl font-black jp-display text-ink-soft py-3.5 hover:text-brand-700"
          >
             よくある質問
          </button>
          <a
            href={`#${SectionId.Pricing}`}
            className="mt-8 inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-xl bg-brand-500 text-ink font-black jp-display text-base shadow-cta hover:bg-brand-400 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            お申し込み <GenIcon name="arrow-up-right" className="w-5 h-5" />
          </a>
          <a
            href="https://lms.techstars.studio/login"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-xl border-2 border-brand-500 text-brand-700 font-bold text-base hover:bg-brand-500 hover:text-ink transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            受講生専用ページ <GenIcon name="arrow-up-right" className="w-5 h-5" />
          </a>
        </div>
      )}
    </>
  );
};
