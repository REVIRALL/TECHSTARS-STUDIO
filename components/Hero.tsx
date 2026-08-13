import React from 'react';
import { SectionId } from '../types';
import { ArrowRight } from 'lucide-react';
import { ImageFrame } from './ImageFrame';

/**
 * ヒーロー。
 *
 * 方針:
 *  - 主役は「7日間で / プロへ。」の一行だけ。他は全部それを支える脇役に落とす
 *  - 枠線で構造を作らない。余白・階層・光で作る
 *  - 数字は4つの別々のカードではなく、1本のスペックバーとして扱う
 *  - LPなのでファーストビュー内にCTAを置く
 */

const STATS = [
  { value: '7', unit: '日間', label: '最短で完走' },
  { value: '3', unit: '種', label: '動くシステムを作る' },
  { value: '1:1', unit: '', label: 'マンツーマン指導' },
  { value: '∞', unit: '', label: '卒業後もつながる' },
];

export const Hero: React.FC = () => {
  return (
    <section
      id={SectionId.Home}
      className="relative min-h-[100svh] flex flex-col justify-end bg-black text-white overflow-hidden"
    >
      {/* ===== 背景 ===== */}
      <div className="absolute inset-0 z-0">
        <ImageFrame
          slot="hero.backdrop"
          fill
          priority
          imgClassName="object-cover object-[70%_center] sm:object-center"
          placeholderClassName="opacity-60"
          chipPosition="top-24 right-4"
        >
          {/* 画像を潰さず、文字が乗る側だけを落とす。
              一枚の斜めグラデで「左が暗く、右に光が残る」状態を作る */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(100deg,#000_18%,rgba(0,0,0,0.86)_42%,rgba(0,0,0,0.35)_72%,rgba(0,0,0,0.1)_100%)]" />
          {/* 上下だけ締めて、次のセクションへ黒で繋ぐ */}
          <div className="absolute inset-x-0 top-0 h-40 pointer-events-none bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none bg-gradient-to-t from-black via-black/70 to-transparent" />
        </ImageFrame>
      </div>

      {/* ===== 本文 ===== */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-10 sm:pb-14">
        {/* 見出し上のひと言。罫線1本だけで区切る */}
        <div className="flex items-center gap-4 mb-7 sm:mb-9 opacity-0 animate-hero-badge">
          <span className="h-px w-8 sm:w-14 bg-brand-500" />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] text-brand-400">
            AI ENGINEER BOOTCAMP
          </span>
        </div>

        {/* 主役 */}
        <h1 className="opacity-0 animate-hero-title mb-8 sm:mb-10">
          <span className="block text-[15vw] sm:text-[12.5vw] lg:text-[10.5vw] xl:text-[9.5vw] leading-[0.82] font-black tracking-[-0.045em] text-white/95">
            7日間で
          </span>
          <span className="block text-[15vw] sm:text-[12.5vw] lg:text-[10.5vw] xl:text-[9.5vw] leading-[0.82] font-black tracking-[-0.045em] text-brand-500 [text-shadow:0_0_90px_rgba(0,229,255,0.5)]">
            プロへ。
          </span>
        </h1>

        {/* 支える一文。カードに入れず、素のまま置く */}
        <div className="opacity-0 animate-hero-desc max-w-[34ch] sm:max-w-[46ch] mb-9 sm:mb-11">
          <p className="text-base sm:text-lg lg:text-xl leading-[1.85] text-slate-300">
            コードは書かない。<span className="text-white font-semibold">AIに指示を出す。</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            7日後、動くシステムが3つ、手元に残る。
          </p>
        </div>

        {/* CTA。ファーストビュー内に必ず置く */}
        <div className="opacity-0 animate-hero-desc flex flex-wrap items-center gap-3 sm:gap-4 mb-14 sm:mb-20">
          <a
            href={`#${SectionId.Contact}`}
            className="group inline-flex items-center gap-2.5 bg-white text-black pl-6 pr-5 py-3.5 sm:py-4 text-sm sm:text-base font-bold tracking-tight hover:bg-brand-500 transition-colors duration-300"
          >
            無料で詳細を見る
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
          <a
            href={`#${SectionId.Portfolio}`}
            className="inline-flex items-center gap-2 px-1 py-3.5 sm:py-4 text-sm sm:text-base text-slate-300 hover:text-brand-400 transition-colors border-b border-transparent hover:border-brand-400"
          >
            カリキュラムを見る
          </a>
        </div>

        {/* 数字。4枚の別デザインをやめて1本の帯にする */}
        <dl className="opacity-0 animate-hero-cards grid grid-cols-2 lg:grid-cols-4 border-t border-white/10">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={[
                'group py-5 sm:py-7 lg:py-8 border-white/10',
                // 左端のセルだけ左パディングを外して見出しと縦を揃える
                i % 2 === 0 ? 'pr-4 lg:pr-8' : 'pl-4 pr-4 lg:pl-8 lg:pr-8',
                i === 0 ? '' : 'lg:pl-8',
                // モバイルは2列: 全セルに下線、左列に縦線
                'border-b lg:border-b-0',
                i % 2 === 0 ? 'border-r lg:border-r' : 'lg:border-r',
                // PCは4列: 最後のセルだけ縦線を消す
                i === 3 ? 'lg:border-r-0' : '',
              ].join(' ')}
            >
              <dd className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.04em] text-white tabular-nums transition-colors duration-300 group-hover:text-brand-400">
                  {s.value}
                </span>
                {s.unit && <span className="text-base sm:text-lg font-bold text-slate-400">{s.unit}</span>}
              </dd>
              <dt className="text-[11px] sm:text-xs text-slate-500 tracking-wide">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* スクロール誘導。細い線が下に伸びるだけ */}
      <div className="hidden lg:flex absolute bottom-0 right-12 z-20 flex-col items-center gap-3 pointer-events-none">
        <span className="font-mono text-[10px] tracking-[0.3em] text-slate-600 [writing-mode:vertical-rl]">
          SCROLL
        </span>
        <span className="w-px h-16 bg-gradient-to-b from-brand-500/60 to-transparent" />
      </div>
    </section>
  );
};
