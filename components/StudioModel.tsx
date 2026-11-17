import React from 'react';
import { SectionId } from '../types';
import { ImageFrame } from './ImageFrame';

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
    <section id={SectionId.Model} className="lp-sec relative bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <div className="anim-hidden anim-up mb-8 lg:mb-12">
          <h2 className="text-[28px] md:text-[36px] lg:text-[52px] leading-[1.25] font-black jp-display text-ink [word-break:keep-all]">
            いまは、コードを覚える前に、
            <br />
            <span className="text-brand-700">AIに書かせて作れます。</span>
          </h2>
        </div>

        {/* ===== 学習の流れ（進め方） ===== */}
        <div className="anim-hidden anim-up flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 mb-6 lg:mb-8">
          <h3 className="shrink-0 text-2xl lg:text-3xl font-black text-ink">学習の流れ</h3>
          <p className="text-base lg:text-lg font-bold leading-[1.8] text-ink-soft [word-break:keep-all] [overflow-wrap:anywhere]">
            授業では、作りたい物をAIに伝え、出てきたコードを動かして確かめます。
          </p>
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
                <h4 className="font-black text-xl lg:text-[22px] leading-snug text-ink mb-2.5 [word-break:keep-all]">
                  {item.title}
                </h4>
                <p className="text-sm text-ink-mute leading-relaxed text-pretty">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
