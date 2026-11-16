import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { SectionId } from '../types';
import { Check, Terminal } from 'lucide-react';
import { ImageFrame } from './ImageFrame';

/**
 * こういう人向け と 君も、星になれ。（お問い合わせ）
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/07-contact.png。
 *  - 上：白いカード6枚（水色のチェック）と、水色の枠の一言の帯。前のカード面の暗い質感の画像は外した。
 *  - 下：暗い星空をやめ、明るい光の写真（contact.cta）を敷き、左に見出しと説明、右に相談の箱（白い窓）。
 *    1回目の絵は上の写真が最初の画面の女性とそっくり、下の写真が「ノートPCに向かう黒髪の男性」になったので描き直させた。
 *  - 引用の上に引いていた区切りの線は外した（注記の上下に飾りの線を引かない）。
 *  - スマホは写真（4:5）の上の明るい所に見出しを載せ、その下に引用と相談の箱を続ける（写真は消さない）。
 */

/**
 * AI診断フォームは react-markdown と @google/genai を引き連れてくる。
 * 初期表示ではまず見えない位置にあるので、別チャンクに切り出して
 * このセクションが画面に入るまで読み込まない。
 * 見た目が変わらないよう、読み込み前は同じ形のスケルトンを出す。
 */
const IdeaValidator = lazy(() =>
  import('./IdeaValidator').then((m) => ({ default: m.IdeaValidator }))
);

const ValidatorSkeleton: React.FC = () => (
  <div className="w-full" aria-hidden="true">
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 text-brand-700">
      <Terminal className="w-4 h-4" />
      <span className="text-[12px] font-mono font-bold tracking-normal sm:tracking-widest uppercase whitespace-nowrap">AI_DIAGNOSTIC_SYSTEM v2.0</span>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-slate-300 rounded-full" />
        <span className="text-[12px] font-mono text-ink-mute">STANDBY</span>
      </div>
    </div>
    <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
      <div className="relative">
        <div className="absolute top-4 left-4 font-mono font-bold text-brand-700 text-sm">&gt;_</div>
        <div className="w-full pl-11 pr-4 py-4 font-mono text-sm text-slate-500 min-h-[92px]">
          あなたの目標やお悩みを入力...
        </div>
      </div>
      <div className="px-4 py-3 flex justify-between items-center bg-white">
        <span className="text-[12px] text-ink-mute font-mono whitespace-nowrap">GEMINI_ENGINE</span>
        <div className="min-h-[44px] flex items-center px-6 rounded-lg bg-slate-200 text-ink-mute text-sm font-mono font-bold tracking-widest">
          EXECUTE
        </div>
      </div>
    </div>
  </div>
);

const TARGETS = [
  'Progateで挫折した。でも諦めたくない',
  '仕事が忙しい。週末しか時間がない',
  'ChatGPTは使ってる。もっと実用的に使いたい',
  '副業したい。でも何から始めていいかわからない',
  '毎日同じ作業の繰り返し。自動化したい',
  'エンジニアに転職したい。独学は限界',
];

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  // 相談の箱（AI診断）の重い部品は、この区画が画面に入ってから読み込む
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
    <section ref={sectionRef} id={SectionId.Contact} className="lp-sec !pb-0 bg-white relative overflow-hidden">
      <div className="lp-glow opacity-70 [background-position:right_top] [mask-image:linear-gradient(180deg,#000_0%,transparent_40%)]" aria-hidden="true" />

      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 relative">
        {/* ===== こんな人におすすめ ===== */}
        <div className="relative z-10 mb-12 lg:mb-6">
          <div className="anim-hidden anim-up mb-8 lg:mb-10">
            <p className="font-mono font-bold text-xs sm:text-sm text-brand-700 mb-4 tracking-[0.3em]">// TARGET_PROFILE.scan()</p>
            <h2 className="text-[28px] md:text-[36px] lg:text-[56px] leading-[1.15] font-black jp-display text-ink">
              <span className="text-brand-700">こういう人</span>向け
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {TARGETS.map((text) => (
              <div
                key={text}
                className="anim-hidden anim-up group relative rounded-xl bg-white shadow-card hover:shadow-lift transition-shadow duration-300"
              >
                <div className="flex h-full items-center gap-4 p-5 sm:px-6 sm:py-6">
                  <Check className="w-6 h-6 shrink-0 text-brand-600" strokeWidth={3} aria-hidden="true" />
                  <p className="jp-body text-[15px] font-medium text-ink text-pretty">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="anim-hidden anim-up mt-8 lg:mt-10 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-xl border-2 border-brand-400 bg-white px-6 py-4">
              <span className="hidden sm:inline-block w-3.5 h-3.5 rounded-sm bg-brand-500" aria-hidden="true" />
              <p className="text-ink font-black text-[15px] sm:text-base text-balance">
                <span className="text-brand-700">1つでも刺さったら、</span>詳細を見てほしい。
              </p>
              <span className="font-mono font-bold text-[12px] text-brand-700">SIGNAL_DETECTED</span>
            </div>
          </div>
        </div>

        {/* ===== お問い合わせ ===== */}
        <div className="relative grid lg:grid-cols-2 gap-x-12 xl:gap-x-20 lg:py-24">
          {/* 写真。スマホは4:5の写真の上に見出しを載せ、PC は区画の幅いっぱいに敷く */}
          <div className="col-start-1 row-start-1 relative -mx-5 sm:-mx-6 aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:mx-0 lg:absolute lg:inset-y-0 lg:left-1/2 lg:w-screen lg:-translate-x-1/2">
            <ImageFrame
              slot="contact.cta"
              fill
              density="compact"
              imgClassName="object-[50%_100%] lg:object-[62%_30%]"
              placeholderClassName="opacity-25"
              chipPosition="top-2 right-6"
            >
              <div className="absolute inset-0 pointer-events-none lg:hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.82)_36%,rgba(255,255,255,0)_58%)]" />
              <div className="absolute inset-0 pointer-events-none hidden lg:block bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.82)_24%,rgba(255,255,255,0.2)_38%,rgba(255,255,255,0)_48%)]" />
            </ImageFrame>
          </div>

          {/* 見出しと説明 */}
          <div className="anim-hidden anim-left col-start-1 row-start-1 relative z-10 self-start pt-6 sm:pt-10 lg:pt-0">
            <h2 className="text-[44px] md:text-6xl lg:text-7xl leading-[1.08] font-black text-ink tracking-tight mb-5 lg:mb-6">
              君も、<br /><span className="text-brand-700">星になれ。</span>
            </h2>
            <p className="text-[15px] sm:text-lg text-ink-soft font-medium leading-[1.8] max-w-md">
              TECHSTARSは「TECH × 星」。<br/>
              テクノロジーの力で、あなたを輝く星に変える。<br/>
              <span className="text-ink font-bold">7日後、別人になっている。</span>
            </p>
          </div>

          {/* 引用と連絡先 */}
          <div className="anim-hidden anim-left col-start-1 row-start-2 relative z-10 pt-8 lg:pt-10">
            <p className="mb-8 max-w-md text-sm sm:text-[15px] leading-[1.8] text-ink-soft">
              "コードを書かなくても、システムは作れる。<br/>
              AIを味方につけた者が、次の時代を創る。"
            </p>

            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-x-3 font-mono text-sm">
                <span className="text-brand-700 font-bold">$</span>
                <span className="text-ink-mute">mission</span>
                <span className="text-ink">BECOME_A_STAR</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 font-mono text-sm">
                <span className="text-brand-700 font-bold">$</span>
                <span className="text-ink-mute">contact</span>
                <span className="text-ink">support@techstars.studio</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 font-mono text-sm">
                <span className="text-brand-700 font-bold">$</span>
                <span className="text-ink-mute">status</span>
                <span className="text-green-700 font-bold">LAUNCHING_NOW</span>
              </div>
            </div>
          </div>

          {/* 相談の箱 */}
          <div className="anim-hidden anim-right col-start-1 row-start-3 lg:col-start-2 lg:row-start-1 lg:row-span-2 relative z-10 pt-10 pb-12 lg:p-0 lg:self-center">
            <div className="overflow-hidden rounded-2xl bg-white/95 backdrop-blur shadow-lift ring-1 ring-slate-200/70">
              {/* 窓の上の帯 */}
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 sm:px-5 py-3.5 bg-[#F4F8FB]">
                <div className="flex items-center gap-2" aria-hidden="true">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <span className="font-mono text-[12px] sm:text-[13px] text-ink-mute">ai_consultation.exe</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-500 rounded-full" aria-hidden="true" />
                  <span className="font-mono text-[12px] font-bold text-brand-700">READY</span>
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="font-mono font-black text-brand-700 text-xl">&gt;</span>
                  <h3 className="text-xl sm:text-2xl font-black text-ink">無料で詳細を確認</h3>
                </div>
                {isVisible ? (
                  <Suspense fallback={<ValidatorSkeleton />}>
                    <IdeaValidator />
                  </Suspense>
                ) : (
                  <ValidatorSkeleton />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
