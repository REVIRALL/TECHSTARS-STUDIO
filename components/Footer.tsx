import React, { useEffect, useRef, useState } from 'react';
import { PageType } from '../types';
import { PageLink } from './PageLink';
import { BUILD_DAY, COURSE, ORG } from '../content/site';

interface FooterProps {
  /** トップページでのみ渡す。渡されたときだけ詳細ページをオーバーレイで開く */
  onOpenPage?: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPage }) => {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const linkClass = 'text-left py-2 hover:text-brand-500 transition-colors';

  return (
    <footer ref={footerRef} className="bg-black text-white pt-28 lg:pt-44 pb-12 relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-500/60 via-brand-500/20 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-16">
          <div className={`anim-hidden anim-up ${isVisible ? 'anim-visible' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="" aria-hidden="true" width={40} height={40} className="h-10 w-auto" />
              <span className="flex items-baseline gap-1">
                <span className="font-black text-white text-base tracking-tight">TECHSTARS</span>
                <span className="font-mono text-brand-500 text-xs tracking-widest">STUDIO</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-5">
              {/* ラテン文字のブランド名とカタカナ表記は検索エンジンが結び付けてくれない。
                  「テックスターズ」で探した人に届くよう、読みを1度だけ本文に置く */}
              TECHSTARS STUDIO（テックスターズスタジオ）は、{ORG.legalName}が運営する
              AI開発スクールです。{COURSE.durationLabel}でプロへ。AIと作る、動くシステム3つ。
            </p>
            {/* 事業者の実体。検索エンジンにも人間にも、誰が売っているのかを明示する */}
            <address className="not-italic text-[11px] text-slate-500 leading-relaxed">
              {ORG.legalName}
              <br />
              {ORG.address}
              <br />
              <a href={ORG.telUri} className="hover:text-brand-500 transition-colors">
                {ORG.tel}
              </a>
              {' / '}
              <a href={`mailto:${ORG.email}`} className="hover:text-brand-500 transition-colors">
                {ORG.email}
              </a>
            </address>
          </div>

          <nav
            aria-label="フッターナビゲーション"
            className={`flex flex-wrap gap-8 md:gap-12 font-mono text-xs anim-hidden anim-up ${
              isVisible ? 'anim-visible delay-2' : ''
            }`}
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-slate-500 font-bold pb-2">プログラム</h2>
              <a href="/" className={linkClass}>
                トップ
              </a>
              <PageLink route="pricing" onOpenPage={onOpenPage} className={linkClass}>
                料金プラン
              </PageLink>
              <PageLink route="faq" onOpenPage={onOpenPage} className={linkClass}>
                よくある質問
              </PageLink>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-slate-500 font-bold pb-2">受講生</h2>
              <a
                href="https://techstars-lms.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-brand-500 hover:text-brand-400 transition-colors"
              >
                受講生専用ページ
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-slate-500 font-bold pb-2">法的情報</h2>
              <PageLink route="privacy" onOpenPage={onOpenPage} className={linkClass}>
                プライバシーポリシー
              </PageLink>
              <PageLink route="terms" onOpenPage={onOpenPage} className={linkClass}>
                利用規約
              </PageLink>
              <PageLink route="tokushoho" onOpenPage={onOpenPage} className={linkClass}>
                特定商取引法に基づく表記
              </PageLink>
            </div>
          </nav>
        </div>

        <div
          className={`border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 anim-hidden anim-up ${
            isVisible ? 'anim-visible delay-3' : ''
          }`}
        >
          <p className="font-mono text-[10px] text-slate-600">
            COPYRIGHT &copy; {new Date().getFullYear()} {ORG.englishName.toUpperCase()} ALL RIGHTS RESERVED.
            {/* 情報の鮮度は検索でも生成AIでも効く。人にも機械にも読める形で出す */}
            <span className="ml-2">
              最終更新 <time dateTime={BUILD_DAY}>{BUILD_DAY}</time>
            </span>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true" />
            <span className="font-mono text-[10px] text-slate-500">受付中</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
