import React, { useEffect, useRef, useState } from 'react';
import { SectionId } from '../types';
import { Zap, AlertTriangle } from 'lucide-react';
import { ImageFrame } from './ImageFrame';

const FLOW = [
  {
    slot: 'flow.01',
    step: '01',
    title: 'PROMPT',
    desc: '「何を作るか」を言語化する。曖昧な要件を、AIが理解できる指示に変換。',
  },
  {
    slot: 'flow.02',
    step: '02',
    title: 'GENERATE',
    desc: 'AIがコードを生成。HTML、CSS、JavaScript、バックエンド。全部AIが書く。',
  },
  {
    slot: 'flow.03',
    step: '03',
    title: 'DEBUG',
    desc: 'エラーが出たらAIに投げる。原因特定から修正まで数秒。',
  },
  {
    slot: 'flow.04',
    step: '04',
    title: 'SHIP',
    desc: '動くものをデプロイ。Day 7には、本番環境で動くシステムが手元にある。',
  },
];

export const StudioModel: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={SectionId.Model}
      className="relative bg-black pt-28 lg:pt-44 pb-24 lg:pb-36 overflow-hidden"
    >
      <div className="absolute inset-0 cyber-grid opacity-[0.18] pointer-events-none" />
      <div className="aurora opacity-50" />
      <div className="absolute top-0 left-0 w-full section-rule" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        {/* ===== 時代背景 ===== */}
        <div className={`mb-16 lg:mb-28 anim-hidden anim-up ${isVisible ? 'anim-visible' : ''}`}>
          <p className="font-mono text-xs text-brand-500 mb-4 tracking-widest">// WHY NOW?</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black italic tracking-tighter text-white mb-10 lg:mb-14">
            エンジニアリングの
            <br />
            <span className="text-gradient-cyan">ルールが変わった。</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4 lg:gap-6 mb-14">
            {/* --- 過去 --- */}
            <div
              className={`relative overflow-hidden border border-slate-800 min-h-[440px] sm:min-h-[520px] flex anim-hidden anim-left ${
                isVisible ? 'anim-visible delay-1' : ''
              }`}
            >
              <ImageFrame
                slot="model.legacy"
                fill
                density="compact"
                imgClassName="opacity-[0.65] grayscale contrast-90"
                placeholderClassName="opacity-50"
                chipPosition="bottom-4 right-4"
              >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-black/90 to-black/40" />
              </ImageFrame>

              <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-end w-full">
                <div className="flex justify-between items-start mb-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border border-slate-700 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-slate-600 tracking-widest block">LEGACY</span>
                      <span className="font-mono text-xs text-slate-400">従来の学習</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-3 py-1 border border-slate-700 bg-black/60 backdrop-blur-sm text-slate-500 tracking-widest">
                    DEPRECATED
                  </span>
                </div>

                <div className="mt-8 mb-6">
                  <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-500 leading-none relative inline-block">
                    2〜3年
                    <span className="absolute left-0 top-1/2 w-full h-[4px] bg-red-500/70 -rotate-3" />
                  </p>
                </div>

                {/* 囲みも縦線も置かず、区切りは水平の細い罫線だけにする */}
                <ul className="text-sm border-t border-white/[0.07]">
                  {[
                    'プログラミングスクールで基礎学習',
                    '膨大なコードを暗記・写経',
                    'エラーで何時間も詰まる日々',
                    'やっと「初心者エンジニア」へ',
                  ].map((t) => (
                    <li key={t} className="flex items-baseline gap-3.5 py-3 border-b border-white/[0.07]">
                      <span className="text-slate-600 text-xs shrink-0" aria-hidden="true">×</span>
                      <span className="text-slate-400">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* --- 現在 --- */}
            <div
              className={`relative overflow-hidden border border-brand-500/50 hover:border-brand-500 transition-colors duration-300 min-h-[440px] sm:min-h-[520px] flex group anim-hidden anim-right ${
                isVisible ? 'anim-visible delay-2' : ''
              }`}
            >
              <ImageFrame
                slot="model.ai"
                fill
                density="compact"
                imgClassName="opacity-70 group-hover:opacity-90 transition-opacity duration-700"
                placeholderClassName="opacity-50"
                chipPosition="bottom-4 right-4"
              >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-black/85 to-black/30" />
                <div className="absolute inset-0 pointer-events-none scanlines opacity-30" />
              </ImageFrame>

              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-brand-500/20 rounded-full blur-3xl group-hover:bg-brand-500/30 transition-all pointer-events-none" />

              <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-end w-full">
                <div className="flex justify-between items-start mb-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-500 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                      <Zap className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-brand-400 tracking-widest block">AI_DRIVEN</span>
                      <span className="font-mono text-xs text-brand-500">AI時代の学習</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                    <span className="font-mono text-[10px] px-3 py-1 bg-brand-500 text-black font-bold tracking-widest">
                      ACTIVE
                    </span>
                  </div>
                </div>

                <div className="mt-8 mb-6">
                  <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-brand-500 leading-none glitch-hover [text-shadow:0_0_50px_rgba(0,229,255,0.4)]">
                    7日間
                  </p>
                  <div className="w-20 h-1 bg-brand-500 mt-2 group-hover:w-full transition-all duration-500" />
                </div>

                <ul className="text-sm border-t border-brand-500/20">
                  {[
                    'AIがコードを生成、あなたは指示と判断',
                    '「何を作るか」に集中できる',
                    'エラーもAIが解決をサポート',
                    '最短距離で「作れるエンジニア」へ',
                  ].map((t) => (
                    <li key={t} className="flex items-baseline gap-3.5 py-3 border-b border-brand-500/20">
                      <span className="text-brand-500 text-xs shrink-0" aria-hidden="true">✓</span>
                      <span className="text-slate-100">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className={`text-center text-lg md:text-xl font-bold text-white anim-hidden anim-up ${isVisible ? 'anim-visible delay-3' : ''}`}>
            <span className="glass-card inline-block px-5 py-3 border border-brand-500/30 text-brand-400">
              時代が変わった今、学び方も変わるべき。
            </span>
          </p>
        </div>

        {/* ===== 学習の流れ ===== */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12 lg:mb-20">
          <div className={`anim-hidden anim-left ${isVisible ? 'anim-visible delay-4' : ''}`}>
            <p className="font-mono text-xs text-brand-500 mb-4 tracking-widest">// HOW_IT_WORKS</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-white">
              学習の
              <br />
              流れ
            </h2>
          </div>
          <div className={`max-w-xl pt-4 anim-hidden anim-right ${isVisible ? 'anim-visible delay-5' : ''}`}>
            <p className="text-lg font-bold leading-relaxed text-slate-300">
              従来のスクール：コードを覚える。
              <br />
              TechStars：AIに指示を出す。
              <br />
              <span className="text-brand-500">覚えるのはAIの使い方だけ。</span>
              <br />
              <span className="text-brand-500">作るのは本物のシステム。</span>
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {FLOW.map((item, idx) => (
            <article
              key={item.slot}
              className={`group relative bg-[#07080c] border border-slate-800 hover:border-brand-500/60 frame-glow overflow-hidden flex flex-col anim-hidden anim-up ${
                isVisible ? `anim-visible delay-${Math.min(idx + 2, 6)}` : ''
              }`}
            >
              {/* 画像 */}
              <div className="relative">
                <ImageFrame
                  slot={item.slot}
                  density="compact"
                  imgClassName="group-hover:scale-[1.06] transition-transform duration-[900ms] ease-out"
                >
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#07080c] via-transparent to-transparent" />
                  <div className="absolute inset-0 pointer-events-none scanlines opacity-25" />
                </ImageFrame>

                {/* ステップ番号 */}
                <span className="absolute top-3 left-3 z-10 w-9 h-9 bg-brand-500 text-black font-mono font-black text-sm flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.35)]">
                  {item.step}
                </span>
              </div>

              {/* テキスト */}
              <div className="relative p-5 lg:p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-black text-2xl lg:text-3xl text-white tracking-tight group-hover:text-brand-400 transition-colors">
                    {item.title}
                  </h3>
                  <span className="flex-1 h-px bg-slate-800 group-hover:bg-brand-500/40 transition-colors" />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              {/* 下端の進捗ライン */}
              <span className="absolute bottom-0 left-0 h-[2px] bg-brand-500 w-0 group-hover:w-full transition-all duration-500" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
