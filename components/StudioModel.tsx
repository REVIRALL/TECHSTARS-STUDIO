import React from 'react';
import { SectionId } from '../types';
import { ImageFrame } from './ImageFrame';
import { MAKES } from '../content/program';

/**
 * 7日間で作る3つの物 と 学習の流れ（進め方）。
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
 *    #4 従来と AI の鏡写しの対比（×4と✓4・「2〜3年」・「時代が変わった今…」・頭を抱える男性の写真）をやめ、
 *       「7日間で作る3つの物」の表に（中身は content/program.ts＝料金の7日間コースと FAQ に合わせた物）。
 *    #5 学習の流れの説明を1文に。#6 段の名前を日本語に。#7 言い過ぎの「全部AIが書く。」「数秒」をやめる。
 *    1段目の説明は、新しい段の名前「作る物を言葉にする」と同じ言い回し（「何を作るか」を言語化する）を外した。
 *  学習の流れの小見出しには id="flow" を付け、ナビの「学習の流れ」はここへ飛ばす。
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
        {/* ===== 7日間で作る3つの物 ===== */}
        <div className="mb-16 lg:mb-24">
          <div className="anim-hidden anim-up">
            <h2 className="text-[28px] md:text-[36px] lg:text-[52px] leading-[1.25] font-black jp-display text-ink mb-8 lg:mb-12 [word-break:keep-all]">
              いまは、コードを覚える前に、
              <br />
              <span className="text-brand-700">AIに書かせて作れます。</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-5 lg:gap-7 items-stretch">
            <div className="anim-hidden anim-left lg:col-span-5 relative overflow-hidden rounded-2xl bg-slate-100 shadow-card aspect-[16/10] lg:aspect-auto lg:min-h-[380px]">
              <ImageFrame slot="model.ai" fill density="compact" imgClassName="object-[60%_35%]" />
            </div>

            <div className="anim-hidden anim-right lg:col-span-7 rounded-2xl bg-white shadow-card px-5 sm:px-7 lg:px-9 py-6 lg:py-8">
              <h3 className="text-xl lg:text-2xl font-black text-ink mb-2 lg:mb-3">7日間で作る3つの物</h3>
              <table className="block md:table w-full border-collapse text-left">
                <thead className="hidden md:table-header-group">
                  <tr className="border-b border-slate-200 text-[13px] text-ink-mute">
                    <th scope="col" className="py-3 pr-6 font-bold">作る物</th>
                    <th scope="col" className="py-3 pr-6 font-bold whitespace-nowrap">講義の日</th>
                    <th scope="col" className="py-3 font-bold">中身</th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group">
                  {MAKES.map((m, i) => (
                    <tr
                      key={m.name}
                      className={`block md:table-row py-4 md:py-0 ${i < MAKES.length - 1 ? 'border-b border-slate-200' : ''}`}
                    >
                      <th scope="row" className="block md:table-cell md:py-5 md:pr-6 align-top text-lg lg:text-xl font-black text-ink [word-break:keep-all]">
                        {m.name}
                      </th>
                      <td className="block md:table-cell mt-1 md:mt-0 md:py-5 md:pr-6 align-top text-sm font-bold text-brand-700 whitespace-nowrap">
                        {m.day}<span className="md:hidden">の講義</span>
                      </td>
                      <td className="block md:table-cell mt-1.5 md:mt-0 md:py-5 align-top text-[15px] leading-relaxed text-ink-soft text-pretty">
                        {m.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ===== 学習の流れ（進め方） ===== */}
        <div id="flow" className="flex flex-col lg:flex-row justify-between items-start gap-5 lg:gap-8 mb-10 lg:mb-14">
          <div className="anim-hidden anim-left">
            <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1.1] font-black jp-display text-ink">
              学習の
              <br />
              流れ
            </h2>
          </div>
          <div className="anim-hidden anim-right max-w-xl lg:pt-6">
            <p className="text-base lg:text-lg font-bold leading-[1.8] text-ink text-balance">
              授業では、作りたい物をAIに伝え、出てきたコードを動かして確かめます。
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
                <h3 className="font-black text-xl lg:text-[22px] leading-snug text-ink mb-2.5 [word-break:keep-all]">
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
