import React, { useState, useEffect } from 'react';
import { SectionId, PageType } from '../types';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenPage: (page: PageType) => void;
}

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

  const navLinks = [
    { label: '学習の流れ', href: `#${SectionId.Model}` },
    { label: 'カリキュラム', href: `#${SectionId.Portfolio}` },
    { label: '料金プラン', href: `#${SectionId.Pricing}` },
    { label: '講師陣', href: `#${SectionId.Team}` },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-[background-color,border-color,padding] duration-300 border-b ${
          isScrolled
            ? 'bg-black/95 border-slate-800 py-3'
            : 'bg-transparent border-transparent py-6'
        }`}
        aria-label="メインナビゲーション"
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 md:gap-3 group z-50 shrink-0">
            <img src="/logo.png" alt="TechStars" className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
            <div className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="font-black text-white text-xs md:text-base tracking-tight">TECHSTARS</span>
              <span className="font-mono text-brand-500 text-[8px] md:text-xs tracking-widest">AI</span>
            </div>
          </a>

          {/* Desktop Menu */}
          {/* ★nav項目を1つ増やすと 1240px 前後で文字が2行に折り返す。
              実測で確認したうえで whitespace-nowrap と余白の詰めで畳んでいる。 */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <div className="flex gap-1 bg-black/50 px-2 py-1 border border-white/10">
                {navLinks.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    className="px-3 lg:px-4 py-2 font-mono text-xs font-bold text-slate-400 hover:text-brand-500 hover:bg-white/5 transition-all whitespace-nowrap"
                >
                    {link.label}
                </a>
                ))}
            </div>

            <div className="h-6 w-[1px] bg-slate-800"></div>

            <button
                onClick={() => onOpenPage(PageType.Company)}
                className="font-mono text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"
            >
                詳細 <ArrowUpRight className="w-3 h-3 shrink-0" />
            </button>
             <button
                onClick={() => onOpenPage(PageType.FAQ)}
                className="font-mono text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"
            >
                FAQ <ArrowUpRight className="w-3 h-3 shrink-0" />
            </button>

            <a
              href={`#${SectionId.Pricing}`}
              className="px-5 py-2 bg-white text-black font-sans font-black jp-display text-sm hover:bg-brand-500 transition-colors duration-300 whitespace-nowrap"
            >
              お申し込み
            </a>
            <a
              href="https://techstars-lms.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-brand-500 text-brand-500 font-mono text-xs font-bold hover:bg-brand-500 hover:text-black transition-colors duration-300 whitespace-nowrap"
            >
              受講生
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col pt-24 px-6">
          {navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              className="text-2xl sm:text-3xl md:text-4xl font-black jp-display text-white py-3 sm:py-4 border-b border-slate-800 hover:text-brand-500 transition-colors flex items-center gap-3 sm:gap-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-xs font-mono text-brand-500">0{idx + 1}</span>
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setIsMenuOpen(false); onOpenPage(PageType.Company); }}
            className="text-left text-xl sm:text-2xl md:text-3xl font-black jp-display text-slate-400 py-3 sm:py-4 border-b border-slate-800 hover:text-white"
          >
             プログラム詳細
          </button>
           <button
            onClick={() => { setIsMenuOpen(false); onOpenPage(PageType.FAQ); }}
            className="text-left text-xl sm:text-2xl md:text-3xl font-black jp-display text-slate-400 py-3 sm:py-4 border-b border-slate-800 hover:text-white"
          >
             よくある質問
          </button>
          <a
            href={`#${SectionId.Pricing}`}
            className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-black font-sans font-black jp-display text-base hover:bg-brand-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            お申し込み <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="https://techstars-lms.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-4 border-2 border-brand-500 text-brand-500 font-mono text-sm font-bold hover:bg-brand-500 hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            受講生専用ページ <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </>
  );
};