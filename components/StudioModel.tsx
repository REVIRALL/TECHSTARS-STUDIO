import React from 'react';
import { SectionId } from '../types';
import { ImageFrame } from './ImageFrame';

/**
 * WHY NOW? と 学習の流れ。
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/02-model.png
 *  （GPT に「今の区画の中身はそのまま、最初の画面 v2 と同じ明るい世界で」と描かせた物）。
 *  - 比べる2枚のカードは、上に写真（従来＝くすんだ調子・AI 時代＝明るい調子）、下に4行の一覧。
 *  - 前の「2〜3年」に掛けていた赤い取り消し線と、「7日間」の下の短い棒は外した（飾りの線を引かない・絵にも無い）。
 *  - 4つの段のカードは、上に写真と番号、下に英字の見出しと説明。見出しの右に伸ばしていた細い線も外した。
 *  - 水色の塗りの上の字は濃紺（白い字は水色の地で 2.4:1 しか無い）。
 *
 * ★2026-11-17 依頼主「// WHY NOW?　こういうのが全部AIっぽい」→ 見た目だけ直した（文は変えていない）。
 *  - 見出しの上の「// WHY NOW?」「// HOW_IT_WORKS」の札、カードの「LEGACY」「DEPRECATED」「AI_DRIVEN」「ACTIVE」と状態の点を外した。
 *  - AI 時代のカードの水色の縁取りと「7日間」の字の光、地のぼかした写真の光を外した。
 *  - 段の番号は等幅の「01」〜「04」をやめ、普通の字の「1」〜「4」に。カードに指を乗せた時に浮く・写真が拡大する動きを外した。
 */

const FLOW = [
  {
    slot: 'flow.01',
    step: '1',
    title: 'PROMPT',
    desc: '「何を作るか」を言語化する。曖昧な要件を、AIが理解できる指示に変換。',
  },
  {
    slot: 'flow.02',
    step: '2',
    title: 'GENERATE',
    desc: 'AIがコードを生成。HTML、CSS、JavaScript、バックエンド。全部AIが書く。',
  },
  {
    slot: 'flow.03',
    step: '3',
    title: 'DEBUG',
    desc: 'エラーが出たらAIに投げる。原因特定から修正まで数秒。',
  },
  {
    slot: 'flow.04',
    step: '4',
    title: 'SHIP',
    desc: '動くものをデプロイ。7日目には、本番環境で動くシステムが手元にある。',
  },
];

const LEGACY = [
  'プログラミングスクールで基礎学習',
  '膨大なコードを暗記・写経',
  'エラーで何時間も詰まる日々',
  'やっと「初心者エンジニア」へ',
];
const AI = [
  'AIがコードを生成、あなたは指示と判断',
  '「何を作るか」に集中できる',
  'エラーもAIが解決をサポート',
  '最短距離で「作れるエンジニア」へ',
];

export const StudioModel: React.FC = () => {
  return (
    <section id={SectionId.Model} className="lp-sec relative bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        {/* ===== 時代背景 ===== */}
        <div className="mb-16 lg:mb-24">
          <div className="anim-hidden anim-up">
            <h2 className="text-[28px] md:text-[36px] lg:text-[56px] leading-[1.15] font-black jp-display text-ink mb-8 lg:mb-12">
              エンジニアリングの
              <br />
              <span className="text-brand-700">ルールが変わった。</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-7 mb-10 lg:mb-12">
            {/* --- 過去 --- */}
            <article className="anim-hidden anim-left relative overflow-hidden rounded-2xl bg-white shadow-card">
              <div className="relative aspect-[16/9]">
                <ImageFrame slot="model.legacy" fill density="compact" imgClassName="object-[50%_40%]">
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0)_32%,rgba(11,27,46,0)_55%,rgba(11,27,46,0.45)_100%)]" />
                </ImageFrame>
                <div className="absolute inset-x-0 top-0 z-10 p-5 sm:p-6 lg:p-8">
                  <span className="block text-base sm:text-lg font-bold text-ink">従来の学習</span>
                </div>
                <p className="absolute left-5 sm:left-6 lg:left-8 bottom-4 lg:bottom-6 z-10 text-5xl sm:text-6xl lg:text-7xl font-black leading-none text-white [text-shadow:0_2px_18px_rgba(11,27,46,0.55)]">
                  2〜3年
                </p>
              </div>
              <ul className="px-5 sm:px-6 lg:px-8 py-2 lg:py-3 text-[15px]">
                {LEGACY.map((t, i) => (
                  <li key={t} className={`flex items-start gap-3.5 py-3.5 ${i < LEGACY.length - 1 ? 'border-b border-slate-200' : ''}`}>
                    <span className="w-5 shrink-0 text-center text-base font-bold leading-[1.6] text-slate-500" aria-hidden="true">×</span>
                    <span className="text-ink-soft text-pretty">{t}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* --- 現在 --- */}
            <article className="anim-hidden anim-right relative overflow-hidden rounded-2xl bg-white shadow-card">
              <div className="relative aspect-[16/9]">
                <ImageFrame slot="model.ai" fill density="compact" imgClassName="object-[60%_35%]">
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_32%,rgba(255,255,255,0)_55%,rgba(255,255,255,0.7)_100%)]" />
                </ImageFrame>
                <div className="absolute inset-x-0 top-0 z-10 p-5 sm:p-6 lg:p-8">
                  <span className="block text-base sm:text-lg font-bold text-brand-700">AI時代の学習</span>
                </div>
                <p className="absolute left-5 sm:left-6 lg:left-8 bottom-4 lg:bottom-6 z-10 text-5xl sm:text-6xl lg:text-7xl font-black leading-none text-brand-700">
                  7日間
                </p>
              </div>
              <ul className="px-5 sm:px-6 lg:px-8 py-2 lg:py-3 text-[15px]">
                {AI.map((t, i) => (
                  <li key={t} className={`flex items-start gap-3.5 py-3.5 ${i < AI.length - 1 ? 'border-b border-slate-200' : ''}`}>
                    <span className="w-5 shrink-0 text-center text-lg font-black leading-[1.35] text-brand-700" aria-hidden="true">✓</span>
                    <span className="text-ink text-pretty">{t}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <p className="anim-hidden anim-up text-center">
            <span className="inline-block px-6 sm:px-8 py-3.5 rounded-xl bg-brand-50 text-brand-700 text-base md:text-lg font-bold text-balance">
              時代が変わった今、学び方も変わるべき。
            </span>
          </p>
        </div>

        {/* ===== 学習の流れ ===== */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-8 mb-10 lg:mb-14">
          <div className="anim-hidden anim-left">
            <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1.1] font-black jp-display text-ink">
              学習の
              <br />
              流れ
            </h2>
          </div>
          <div className="anim-hidden anim-right max-w-xl lg:pt-6">
            <p className="text-base lg:text-lg font-bold leading-[1.8] text-ink">
              従来のスクール：コードを覚える。
              <br />
              TechStars：AIに指示を出す。
              <br />
              <span className="text-brand-700">覚えるのはAIの使い方だけ。</span>
              <br />
              <span className="text-brand-700">作るのは本物のシステム。</span>
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {FLOW.map((item) => (
            <article
              key={item.slot}
              className="anim-hidden anim-up relative overflow-hidden rounded-2xl bg-white shadow-card flex flex-col"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <ImageFrame slot={item.slot} fill density="compact" />
                <span className="absolute top-3 left-3 z-10 min-w-[36px] h-9 px-2 rounded-lg bg-brand-500 text-ink font-black text-base flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <div className="p-5 lg:p-6 flex-1 flex flex-col">
                <h3 className="font-black text-2xl lg:text-[26px] text-ink tracking-tight mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-mute leading-relaxed text-pretty">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
