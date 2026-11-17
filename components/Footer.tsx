import React from 'react';
import { PageType } from '../types';
import { ImageFrame } from './ImageFrame';

interface FooterProps {
  onOpenPage: (page: PageType) => void;
}

/**
 * フッター。
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/08-footer.png
 *  （淡い光の地・今の正規のロゴ（/logo.png）と「TECHSTARS AI」・3列のリンク・下の行に著作権と「受付中」）。
 *  上の端に引いていた水色の線と方眼の地は外した。
 * ★2026-11-17 依頼主「こういうのが全部AIっぽい」→ 地のぼかした写真の光、著作権の上の線、SNS の等幅の書体、
 *  「受付中」の前の緑の点を外し、著作権は「© 2026 TECHSTARS」を普通の字で。
 * ★2026-11-17 文の直し（fix-copy #16）：行き先が「#」のままの SNS（本物の住所が分からない）と「受付中」（決済は準備中）を外した。
 *  一言は、古い見出し「7日間でプロへ。」の言い過ぎをやめ、最初の画面の新しい見出しにそろえた（言い切りの扱い）。
 */
export const Footer: React.FC<FooterProps> = ({ onOpenPage }) => {
  const linkClass = 'inline-flex items-center min-h-[44px] text-left text-ink hover:text-brand-700 transition-colors';
  return (
    <footer className="relative bg-mist text-ink overflow-x-clip pt-[150px] sm:pt-[170px] lg:pt-[232px] pb-8 lg:pb-12">
      {/* ★2026-11-17 円と曲線の版。正本は designs/lp-creative/sections/footer-pc.png。
          上の端は白から淡い水色への波。右上に丸い写真（波の上にかかる）と円の色面。 */}
      <div aria-hidden="true" className="wave wave-top wave-flip [--from:#ffffff]" />
      <span aria-hidden="true" className="dot w-16 h-16 lg:w-[140px] lg:h-[140px] right-[44%] sm:right-[28%] lg:right-[34%] top-[36px] lg:top-[14px] z-[1]" />
      <div aria-hidden="true" className="absolute z-[2] right-[6%] lg:right-[17%] top-[12px] lg:-top-[118px] w-[136px] sm:w-[170px] lg:w-[316px] aspect-square rounded-full overflow-hidden bg-white">
        <ImageFrame slot="footer.person" fill density="compact" hideChip imgClassName="object-[50%_30%]" />
      </div>
      <span aria-hidden="true" className="dot dot-deep w-7 h-7 lg:w-12 lg:h-12 right-[3%] lg:right-[14.6%] top-[120px] lg:top-[72px] z-[3]" />
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-[52px] relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12 mb-12 lg:mb-14">
          <div className="anim-hidden anim-up">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <img src="/logo.png" alt="TechStars" width={698} height={626} loading="lazy" className="h-14 sm:h-16 w-auto" />
              <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                <span className="font-black text-ink text-xl sm:text-2xl tracking-tight">TECHSTARS</span>
                <span className="font-black text-brand-700 text-xl sm:text-2xl tracking-tight">AI</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-ink-soft max-w-xs sm:max-w-none">
              7日間で、動くシステムを3つ作る。
            </p>
          </div>

          <div className="anim-hidden anim-up flex flex-wrap gap-x-12 gap-y-8 lg:gap-x-16 text-sm sm:text-[15px]">
            <div className="flex flex-col">
              <span className="text-ink-mute font-bold pb-1">受講生</span>
              <a
                href="https://lms.techstars.studio/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] font-bold text-brand-700 hover:text-brand-800 transition-colors"
              >
                受講生専用ページ
              </a>
            </div>
            <div className="flex flex-col">
              <span className="text-ink-mute font-bold pb-1">法的情報</span>
              <button onClick={() => onOpenPage(PageType.Privacy)} className={linkClass}>
                プライバシーポリシー
              </button>
              <button onClick={() => onOpenPage(PageType.Terms)} className={linkClass}>
                利用規約
              </button>
              <button onClick={() => onOpenPage(PageType.Tokushoho)} className={linkClass}>
                特定商取引法に基づく表記
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-[13px] text-ink-mute text-center md:text-left">&copy; {new Date().getFullYear()} TECHSTARS</p>
        </div>
      </div>
    </footer>
  );
};
