import React from 'react';
import { SectionId } from '../types';
import { ImageFrame } from './ImageFrame';
import { GenIcon } from './GenIcon';

/**
 * 学習の流れ（進め方）。
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/02-model.png
 *  （GPT に「今の区画の中身はそのまま、最初の画面 v2 と同じ明るい世界で」と描かせた物）。
 *  - 4つの段のカードは、上に写真と番号、下に見出しと説明。見出しの右に伸ばしていた細い線も外した。
 *  - 水色の塗りの上の字は濃紺（白い字は水色の地で 2.4:1 しか無い）。
 *
 * ★2026-11-17 依頼主「// WHY NOW?　こういうのが全部AIっぽい」→
 *  見た目（fix-visual.md）：英字の札「// WHY NOW?」「// HOW_IT_WORKS」・「LEGACY」「ACTIVE」などの状態表示・
 *    水色の縁取り・字の光・地のぼかした写真の光・浮く動きを外し、段の番号は普通の字の「1」〜「4」に。
 *  文（fix-copy.md）：
 *    #3 見出しを「いまは、コードを覚える前に、AIに書かせて作れます。」に。
 *    #4 従来と AI の鏡写しの対比（×4と✓4・「2〜3年」・「時代が変わった今…」・頭を抱える男性の写真）をやめた。
 *       一度「7日間で作る3つの物」の表に替えたが、「7日後にできること」（Team.tsx）と同じ文が2か所になるので、
 *       残りの片付けで表は外し、作る物は「できること」の1か所にまとめた。この区画は見出しと進め方の4段だけ。
 *    #5 学習の流れの説明を1文に。#6 段の名前を日本語に。#7 言い過ぎの「全部AIが書く。」「数秒」をやめる。
 *    1段目の説明は、新しい段の名前「作る物を言葉にする」と同じ言い回し（「何を作るか」を言語化する）を外した。
 *  大きい見出しが2つ続かないよう、「学習の流れ」は区画の中の小見出しにした。ナビの「学習の流れ」はこの区画（#model）へ飛ぶ。
 */

const FLOW = [
  {
    slot: 'flow.01',
    step: '1',
    title: '作る物を言葉にする',
    desc: '曖昧な要件を、AIが理解できる指示に言い換える。',
  },
  {
    slot: 'flow.02',
    step: '2',
    title: 'AIにコードを書かせる',
    desc: 'HTML、CSS、JavaScript、バックエンドまで、AIにコードを書かせ、動かして確かめる。',
  },
  {
    slot: 'flow.03',
    step: '3',
    title: '動かない所をAIと直す',
    desc: 'エラーの文をAIに渡して、直し方を一緒に探す。',
  },
  {
    slot: 'flow.04',
    step: '4',
    title: '公開する',
    desc: '作った物をインターネットに公開し、URLで見せられる形にする。',
  },
];

export const StudioModel: React.FC = () => {
  return (
    <section id={SectionId.Model} className="lp-sec lp-sec-wave relative bg-white overflow-x-clip">
      {/* ★2026-11-17 円と曲線の版。正本は designs/lp-creative/sections/model-pc.png。
          見出しは左に大きく、右に小見出しと説明。4つの段は丸く切り抜いた写真を横に並べ、写真の間に矢印の印、
          写真の左上に丸い番号。上下の端は淡い水色の波、右上と左下に円の色面。 */}
      <div aria-hidden="true" className="wave wave-top wave-flip [--from:#EDF8FD]" />
      <div aria-hidden="true" className="wave wave-bottom [--from:#EDF8FD]" />
      <span aria-hidden="true" className="dot w-16 h-16 lg:w-[86px] lg:h-[86px] right-[3.5%] top-[64px] lg:top-[84px]" />
      <span aria-hidden="true" className="dot hidden lg:block w-5 h-5 right-[9.5%] top-[160px]" />
      <span aria-hidden="true" className="dot w-28 h-28 lg:w-[180px] lg:h-[180px] -left-14 lg:-left-[72px] bottom-[40px] lg:bottom-[36px] opacity-80" />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-[86px] relative z-10">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,452px)] gap-x-12 gap-y-5 items-start mb-10 lg:mb-14">
          <h2 className="anim-hidden anim-up text-[28px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-[1.3] font-black jp-display text-ink [word-break:keep-all]">
            いまは、コードを覚える前に、
            <br />
            <span className="text-brand-700">AIに書かせて作れます。</span>
          </h2>
          <div className="anim-hidden anim-up lg:pt-6">
            <h3 className="text-xl lg:text-2xl font-black text-ink mb-2.5">学習の流れ</h3>
            <p className="jp-text text-base lg:text-[20px] font-medium leading-[1.8] text-ink-soft">
              授業では、作りたい物をAIに伝え、出てきたコードを動かして確かめます。
            </p>
          </div>
        </div>

        {/* 4つの段。PC は横に4つ、間に矢印の印。641〜1023px は2列、スマホは1列 */}
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-10 gap-y-10">
          {FLOW.map((item, i) => (
            <li key={item.slot} className="anim-hidden anim-up relative grid grid-cols-[clamp(116px,34vw,150px)_minmax(0,1fr)] gap-x-5 items-center sm:flex sm:flex-col">
              <div className="relative w-full sm:w-[78%] lg:w-full max-w-[280px] aspect-square">
                <div className="absolute inset-0 rounded-full overflow-hidden bg-mist">
                  <ImageFrame slot={item.slot} fill density="compact" imgClassName="object-[50%_40%]" />
                </div>
                <span className="absolute left-[2%] top-[6%] z-10 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-brand-300 text-ink font-black text-base sm:text-lg lg:text-xl">
                  {item.step}
                </span>
                {i < FLOW.length - 1 && (
                  <GenIcon name="arrow-right" className="hidden lg:block absolute top-1/2 -right-[34px] -translate-y-1/2 w-7 h-7" />
                )}
              </div>
              <div>
              <h4 className="sm:mt-6 lg:mt-8 font-black text-[19px] sm:text-[22px] lg:text-[24px] xl:text-[26px] leading-snug text-ink mb-3 jp-phrase">
                {item.title}
              </h4>
              <p className="jp-text text-base lg:text-[16px] xl:text-[17px] text-ink-mute leading-[1.75]">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
