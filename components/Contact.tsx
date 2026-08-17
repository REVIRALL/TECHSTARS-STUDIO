import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { SectionId } from '../types';
import { CheckCircle, Terminal } from 'lucide-react';
import { ImageFrame } from './ImageFrame';
import { Icon } from './Icon';
import { COURSE, ORG } from '../content/site';

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
    <div className="flex items-center gap-2 mb-4 text-brand-500">
      <Terminal className="w-4 h-4" />
      <span className="text-[10px] font-mono tracking-widest uppercase">AI_DIAGNOSTIC_SYSTEM v2.0</span>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-slate-700 rounded-full" />
        <span className="text-[10px] font-mono text-slate-600">STANDBY</span>
      </div>
    </div>
    <div className="border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="relative">
        <div className="absolute top-4 left-4 font-mono text-brand-500/50 text-sm">&gt;_</div>
        <div className="w-full pl-10 pr-4 py-4 font-mono text-sm text-slate-700 min-h-[92px]">
          あなたの目標やお悩みを入力...
        </div>
      </div>
      <div className="bg-slate-900 px-4 py-3 flex justify-between items-center border-t border-slate-800">
        <span className="text-[10px] text-slate-600 font-mono">GEMINI_ENGINE</span>
        <div className="px-6 py-2 bg-slate-800 text-slate-600 text-xs font-mono font-bold tracking-widest">
          EXECUTE
        </div>
      </div>
    </div>
  </div>
);

export const Contact: React.FC = () => {
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
    <section ref={sectionRef} id={SectionId.Contact} className="pt-28 lg:pt-44 pb-28 lg:pb-48 bg-black relative overflow-hidden">
      {/* 上部の水平ネオンライン（セクション区切り） */}
      <div className="absolute top-0 left-0 w-full section-rule"></div>

      {/* Cyber Grid Background - 視認性向上 */}
      <div className="absolute inset-0 cyber-grid opacity-[0.18] pointer-events-none"></div>
      <div className="aurora opacity-40"></div>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">

        {/* ===== こんな人におすすめ - Data Display Terminal Pattern ===== */}
        <div className="mb-20 lg:mb-32 relative z-10">
          <div className={`mb-10 anim-hidden anim-up ${isVisible ? 'anim-visible' : ''}`}>
            <p className="font-mono text-xs text-brand-500 mb-4 tracking-widest">// TARGET_PROFILE.scan()</p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black jp-display text-white">
              <span className="text-brand-500">こういう人</span>向け
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'USR-001', text: 'Progateで挫折した。でも諦めたくない', status: 'MATCH' },
              { id: 'USR-002', text: '仕事が忙しい。週末しか時間がない', status: 'MATCH' },
              { id: 'USR-003', text: 'ChatGPTは使ってる。もっと実用的に使いたい', status: 'MATCH' },
              { id: 'USR-004', text: '副業したい。でも何から始めていいかわからない', status: 'MATCH' },
              { id: 'USR-005', text: '毎日同じ作業の繰り返し。自動化したい', status: 'MATCH' },
              { id: 'USR-006', text: 'エンジニアに転職したい。独学は限界', status: 'MATCH' },
            ].map((item, i) => (
              <div
                key={i}
                className={`group relative bg-black border border-slate-800 hover:border-brand-500/50 transition-all duration-300 overflow-hidden anim-hidden anim-up ${isVisible ? `anim-visible delay-${(i % 3) + 1}` : ''}`}
              >
                {/* カード面のテクスチャ。1枚の素材を6枚で位置をずらして共用する */}
                <div className="absolute inset-0 pointer-events-none">
                  <ImageFrame
                    slot="card.surface"
                    fill
                    density="compact"
                    imgClassName="opacity-[0.55] group-hover:opacity-80 transition-opacity duration-500"
                    placeholderClassName="opacity-20"
                    chipPosition="bottom-2 right-2"
                    hideChip={i !== 0}
                    imgStyle={{ objectPosition: `${(i * 17) % 100}% ${(i * 29) % 100}%` }}
                  />
                </div>

                {/* Content */}
                <div className="relative p-5 sm:p-6">
                  <div className="flex items-start gap-3.5">
                    <span className="shrink-0 flex items-center justify-center w-10 h-10 -mt-1 text-brand-500">
                      <Icon slot="icon.check" fallback={CheckCircle} size={40} className="text-brand-500" />
                    </span>
                    <p className="jp-body text-sm text-slate-300 group-hover:text-white transition-colors">{item.text}</p>
                  </div>
                </div>

                {/* Bottom Progress Line */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-500 group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>

          <div className={`mt-10 text-center anim-hidden anim-up ${isVisible ? 'anim-visible delay-4' : ''}`}>
            <div className="inline-flex items-center gap-4 bg-black border border-brand-500/50 px-6 py-4">
              <div className="w-3 h-3 bg-brand-500 animate-pulse"></div>
              <p className="text-white font-bold text-sm">
                <span className="text-brand-500">1つでも刺さったら、</span>詳細を見てほしい。
              </p>
              <span className="font-mono text-[10px] text-brand-400">SIGNAL_DETECTED</span>
            </div>
          </div>
        </div>

        {/* ===== お問い合わせ - Cyberpunk Terminal Pattern ===== */}
        <div className="relative">
          {/* サイト最後の締め。コンセプト「TECH × 星」を回収する背景 */}
          <div className="absolute -inset-x-6 lg:-inset-x-12 -top-24 -bottom-16 pointer-events-none">
            <ImageFrame
              slot="contact.cta"
              fill
              density="compact"
              imgClassName="opacity-50 edge-fade"
              placeholderClassName="opacity-25"
              chipPosition="top-2 right-6"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />
            </ImageFrame>
          </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 relative z-10">

          <div className={`anim-hidden anim-left ${isVisible ? 'anim-visible delay-5' : ''}`}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-6 [text-shadow:0_0_60px_rgba(0,0,0,0.9)]">
              君も、<br /><span className="text-brand-500 [text-shadow:0_0_50px_rgba(0,229,255,0.45)]">星になれ。</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium mb-8 max-w-md">
              TECHSTARSは「TECH × 星」。<br/>
              テクノロジーの力で、あなたを輝く星に変える。<br/>
              <span className="text-white font-bold">7日後、別人になっている。</span>
            </p>

            {/* Mission Statement */}
            <div className="mb-8 pt-6 border-t border-white/10 max-w-md">
              <p className="text-sm text-slate-300">
                "コードを書かなくても、システムは作れる。<br/>
                AIを味方につけた者が、次の時代を創る。"
              </p>
            </div>

            {/* 連絡先。ターミナル風の見た目は残したまま、実際に発信できるリンクにする */}
            <address className="not-italic space-y-3">
              <p className="flex items-center gap-3 font-mono text-sm">
                <span className="text-brand-500" aria-hidden="true">$</span>
                <span className="text-slate-500">mail</span>
                <a href={`mailto:${ORG.email}`} className="text-white hover:text-brand-400 underline underline-offset-4 decoration-slate-700">
                  {ORG.email}
                </a>
              </p>
              <p className="flex items-center gap-3 font-mono text-sm">
                <span className="text-brand-500" aria-hidden="true">$</span>
                <span className="text-slate-500">tel</span>
                <a href={ORG.telUri} className="text-white hover:text-brand-400 underline underline-offset-4 decoration-slate-700">
                  {ORG.tel}
                </a>
              </p>
              <p className="flex items-center gap-3 font-mono text-sm">
                <span className="text-brand-500" aria-hidden="true">$</span>
                <span className="text-slate-500">org</span>
                <span className="text-white">{ORG.legalName}</span>
              </p>
              <p className="flex items-center gap-3 font-mono text-sm">
                <span className="text-brand-500" aria-hidden="true">$</span>
                <span className="text-slate-500">status</span>
                <span className="text-green-400">受付中 / {COURSE.mode}</span>
              </p>
            </address>
          </div>

          <div className={`anim-hidden anim-right ${isVisible ? 'anim-visible delay-6' : ''}`}>
             {/* Terminal Window Frame */}
             <div className="border border-slate-800 bg-black/90 backdrop-blur-sm overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="font-mono text-xs text-slate-500">ai_consultation.exe</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                    <span className="font-mono text-[10px] text-brand-400">READY</span>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="font-mono text-brand-500 text-lg">&gt;</span>
                    <h3 className="text-xl font-bold text-white">無料で詳細を確認</h3>
                  </div>
                  {isVisible ? (
                    <Suspense fallback={<ValidatorSkeleton />}>
                      <IdeaValidator />
                    </Suspense>
                  ) : (
                    <ValidatorSkeleton />
                  )}

                  {/*
                    AI診断は GEMINI_API_KEY があるビルドでしか応答しない。
                    本番にはこの環境変数が設定されていないため、ここまで来た
                    見込み客の導線がこのフォーム1本だと行き止まりになる。
                    常に成立する連絡手段を必ず1つ並べておく。
                  */}
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <p className="text-xs text-slate-500 mb-3">直接相談したい方はこちら</p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`mailto:${ORG.email}?subject=${encodeURIComponent(
                          `【${COURSE.shortName}】受講について問い合わせ`
                        )}&body=${encodeURIComponent(
                          'ご記入ください：\n\n・お名前：\n・ご希望の受講開始時期：\n・現在のご経験（未経験 / 独学中 / 実務あり）：\n・ご質問：\n'
                        )}`}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-brand-500 text-black font-bold text-sm hover:bg-white transition-colors"
                      >
                        メールで問い合わせる
                      </a>
                      <a
                        href={ORG.telUri}
                        className="inline-flex items-center gap-2 px-5 py-3 border border-slate-700 text-slate-300 font-mono text-sm hover:border-brand-500 hover:text-brand-500 transition-colors"
                      >
                        {ORG.tel}
                      </a>
                    </div>
                  </div>
                </div>
             </div>
          </div>

        </div>
        </div>
      </div>
    </section>
  );
};