import React from 'react';
import { SectionId } from '../types';
import { TrendingUp, Clock, ChevronDown } from 'lucide-react';
import { ImageFrame } from './ImageFrame';

export const Hero: React.FC = () => {
  return (
    <section
      id={SectionId.Home}
      className="relative min-h-[88vh] sm:min-h-[92vh] lg:min-h-screen bg-black text-white overflow-hidden pb-16 sm:pb-24"
    >
      {/* ===================================================================
          背景レイヤー
          hero.backdrop の画像が入るとここが丸ごと差し替わる。
          未生成の間はプロンプト入りのフレームが表示される。
          =================================================================== */}
      <div className="absolute inset-0 z-0">
        <ImageFrame
          slot="hero.backdrop"
          fill
          priority
          imgClassName="object-center opacity-[0.55] sm:opacity-60"
          placeholderClassName="opacity-60"
          chipPosition="bottom-6 right-4 sm:bottom-8 sm:right-8"
        >
          {/* 画像の上に必ず乗る処理。画像があってもなくても同じ空気になるようにする */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black via-black/75 to-black/30" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-black/40 to-black/70" />
          <div className="absolute inset-0 pointer-events-none scanlines opacity-40" />
        </ImageFrame>

        <div className="absolute inset-0 cyber-grid opacity-[0.18] pointer-events-none" />
        <div className="aurora opacity-70" />

        {/* AIコアのビジュアル。見出しと数字カードの間の空白を埋めて奥行きを出す */}
        <div className="hidden xl:block absolute left-[40%] top-[44%] w-[360px] h-[360px] pointer-events-none">
          <ImageFrame
            slot="hero.core"
            fill
            density="compact"
            /* 実画像だけ加算合成＋縁をぼかして背景に溶かす。プレースホルダーは通常合成のまま残す */
            imgClassName="mix-blend-screen opacity-80 edge-fade"
            placeholderClassName="opacity-40"
            chipPosition="top-2 left-2"
          />
        </div>
      </div>

      {/* ===================================================================
          コンテンツ
          =================================================================== */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 relative z-20 pt-[104px] sm:pt-[128px] md:pt-[168px] lg:pt-[210px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 sm:gap-10 lg:gap-16">
          <div className="relative w-full lg:w-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 border border-brand-500/50 bg-brand-500/10 backdrop-blur-sm mb-5 sm:mb-7 md:mb-9 opacity-0 animate-hero-badge">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-brand-500 rounded-full animate-blink" />
              <span className="font-mono text-[10px] sm:text-xs font-bold text-brand-400 tracking-widest">
                AIエンジニア育成プログラム
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[13.5vw] sm:text-[11vw] md:text-[9vw] lg:text-[7.2vw] leading-[0.88] sm:leading-[0.84] font-black italic tracking-tighter text-white mb-5 sm:mb-7 md:mb-9 relative opacity-0 animate-hero-title [text-shadow:0_0_80px_rgba(0,0,0,0.9)]">
              <span className="block text-gradient-cyan">7日間で</span>
              <span className="block text-brand-500 [text-shadow:0_0_60px_rgba(0,229,255,0.45)]">プロへ。</span>
            </h1>
          </div>

          <div className="relative lg:mb-14 max-w-xl w-full">
            <div className="relative opacity-0 animate-hero-desc">
              <p className="font-mono text-xs sm:text-sm text-brand-500 mb-2 sm:mb-4">// AI ENGINEER BOOTCAMP</p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-slate-300 mb-5 sm:mb-7 md:mb-9">
                <span className="text-white font-bold italic">コードは書かない。指示を出す。</span>
                <br />
                AIがコードを生成。あなたは設計と判断に集中。
                <br />
                7日間で、動くシステムを3つ作る。
              </p>
            </div>

            {/* Cards */}
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4 opacity-0 animate-hero-cards">
              <div className="glass-card holographic p-3 sm:p-4 hover:-translate-y-1 transition-all duration-300 group">
                <div className="relative icon-glow">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform" />
                </div>
                <p className="font-bold text-xs sm:text-sm">実践形式</p>
                <p className="text-[10px] sm:text-xs text-slate-500">講義90分 → 即実装</p>
              </div>
              <div className="glass-card holographic p-3 sm:p-4 hover:-translate-y-1 transition-all duration-300 group">
                <div className="relative icon-glow">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform" />
                </div>
                <p className="font-bold text-xs sm:text-sm">7日間</p>
                <p className="text-[10px] sm:text-xs text-slate-500">週末だけでも完了可能</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 実績・数字 ===== */}
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-28 opacity-0 animate-hero-cards">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Card 1 */}
            <div className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl relative group overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-transparent" />
              <div className="flex justify-between items-start mb-3 sm:mb-6">
                <span className="font-mono text-[8px] sm:text-[10px] text-brand-400 border border-brand-500/30 px-1.5 sm:px-2 py-0.5 sm:py-1">
                  DURATION
                </span>
              </div>
              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-1 group-hover:scale-110 transition-transform origin-left">
                  7
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-400">日間</div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all" />
            </div>

            {/* Card 2 */}
            <div className="relative bg-black/70 backdrop-blur-sm border border-slate-800 p-4 sm:p-6 lg:p-8 group overflow-hidden hover:border-brand-500 transition-colors duration-300">
              <div className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] font-black text-slate-900 leading-none select-none transition-transform duration-500 group-hover:text-slate-800 group-hover:translate-x-2">
                3
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-brand-500 rounded-full animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-mono text-brand-500 tracking-widest">OUTPUT</span>
                </div>
                <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 glitch-hover">
                  3 TYPES
                </div>
                <div className="w-8 sm:w-12 h-1 bg-brand-500 group-hover:w-full transition-all duration-500" />
                <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">種のシステム</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-3 sm:p-5 lg:p-6 font-mono text-[9px] sm:text-[10px] group hover:border-brand-500/50 transition-colors">
              <div className="flex justify-between text-slate-500 mb-2 sm:mb-4 border-b border-white/5 pb-1.5 sm:pb-2">
                <span>ID: STY-01</span>
                <div className="flex gap-0.5 sm:gap-1">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-700 rounded-full" />
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-700 rounded-full" />
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-brand-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-4 text-slate-300">
                <div className="flex justify-between"><span>STATUS</span><span className="text-brand-400">ACTIVE</span></div>
                <div className="flex justify-between"><span>TYPE</span><span>1:1</span></div>
                <div className="flex justify-between"><span>FORMAT</span><span>PRIVATE</span></div>
              </div>
              <div className="h-0.5 sm:h-1 w-full bg-slate-800 overflow-hidden relative">
                <div className="h-full bg-brand-500 w-full" />
              </div>
              <p className="text-white font-bold text-sm sm:text-lg mt-2 sm:mt-4 font-sans">マンツーマン</p>
            </div>

            {/* Card 4 */}
            <div className="bg-brand-500 p-0.5 sm:p-1 hover:-translate-y-2 hover:-translate-x-2 transition-transform duration-200 group">
              <div className="bg-black text-white h-full p-3 sm:p-5 lg:p-6 border-2 border-transparent">
                <div className="flex justify-between items-baseline border-b-2 border-brand-500 pb-2 sm:pb-4 mb-2 sm:mb-4">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black">∞</span>
                  <span className="text-[8px] sm:text-xs font-bold bg-brand-500 text-black px-1">COMMUNITY</span>
                </div>
                <p className="font-bold text-sm sm:text-lg lg:text-xl leading-tight">
                  卒業生と<br />永久に繋がる
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* スクロール誘導 */}
      <a
        href={`#${SectionId.Model}`}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 text-slate-500 hover:text-brand-500 transition-colors group"
        aria-label="下へスクロール"
      >
        <span className="font-mono text-[10px] tracking-[0.3em]">SCROLL</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
};
