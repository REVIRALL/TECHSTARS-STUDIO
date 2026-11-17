import React from 'react';
import { SectionId } from '../types';
import { ImageFrame } from './ImageFrame';
import { SCHEDULE } from '../content/program';

/**
 * カリキュラム（7日間の表）。
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/03-portfolio.png と 04-process.png。
 *
 * ★2026-11-17 依頼主「// WHY NOW?　こういうのが全部AIっぽい」→
 *  見た目（fix-visual.md）：英字の札・作り物の窓（赤黄緑の丸・curriculum_preview.exe・LIVE・STATUS）・「01」〜「04」の札・
 *    進み具合の棒と %・5〜7日目だけ灰色・地のぼかした写真の光を外し、日付は「1日目」の形に。
 *  文（fix-copy.md #8・#9）：7日間の説明が「カリキュラム」と「学習スケジュール」（と学習の流れ）の3区画に分かれ、
 *    7日目の中身が3通り・3日目の講義が60分と90分で食い違っていたので、この区画の1つの表にまとめた。
 *    中身は content/program.ts（料金の7日間コースと FAQ に合わせた物）。段の英単語（IGNITE など）は使わない。
 *    学習スケジュールの区画（Process.tsx）は外し、その7枚の写真の帯だけこの区画に移した。
 *    ナビ・最初の画面の「カリキュラム」はこの区画（#portfolio）へ飛ぶ。
 */
export const Portfolio: React.FC = () => {
  return (
    <section id={SectionId.Portfolio} className="lp-sec relative bg-mist text-ink overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <div className="anim-hidden anim-up flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-8 lg:mb-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black jp-display text-ink">カリキュラム</h2>
          <p className="max-w-xl text-sm sm:text-[15px] leading-relaxed text-ink-soft md:text-right text-pretty">
            7日間コースの流れです。講義は4回（各90分）で、日程はご相談のうえ決めます。
          </p>
        </div>

        {/* 7日を表す写真の帯（飾り） */}
        <div className="anim-hidden anim-scale mb-6 lg:mb-8 rounded-2xl bg-white shadow-card p-2 sm:p-3">
          <ol className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-1" aria-hidden="true">
            {SCHEDULE.map((d, i) => (
              <li key={d.day} className="flex flex-col">
                <div className={`relative aspect-[4/7] overflow-hidden ${i === 0 ? 'sm:rounded-l-xl' : ''} ${i === SCHEDULE.length - 1 ? 'sm:rounded-r-xl' : ''} rounded-lg sm:rounded-none`}>
                  <ImageFrame slot={`schedule.0${i + 1}`} fill density="compact" imgClassName="object-[50%_30%]" />
                </div>
                <span className="mt-2 mb-1 text-center font-bold text-[13px] text-brand-700">{d.day}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 7日間の表（日・やること・講義か自習・できる物）。スマホは1日ずつ縦に積む */}
        <div className="anim-hidden anim-up rounded-2xl bg-white shadow-card px-5 sm:px-8 lg:px-10 py-2 sm:py-4">
          <table className="block md:table w-full border-collapse text-left">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-slate-200 text-[13px] text-ink-mute">
                <th scope="col" className="py-3.5 pr-6 font-bold whitespace-nowrap">日</th>
                <th scope="col" className="py-3.5 pr-6 font-bold">やること</th>
                <th scope="col" className="py-3.5 pr-6 font-bold whitespace-nowrap">講義・自習</th>
                <th scope="col" className="py-3.5 font-bold whitespace-nowrap">できる物</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {SCHEDULE.map((d, i) => (
                <tr
                  key={d.day}
                  className={`grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 py-4 md:table-row md:py-0 ${i < SCHEDULE.length - 1 ? 'border-b border-slate-200' : ''}`}
                >
                  <th scope="row" className="md:table-cell md:py-5 md:pr-6 align-top text-[15px] md:text-base font-black text-brand-700 whitespace-nowrap">
                    {d.day}
                  </th>
                  <td className="col-span-2 row-start-2 md:table-cell md:py-5 md:pr-6 align-top text-base md:text-[17px] font-bold leading-relaxed text-ink [word-break:keep-all] [overflow-wrap:anywhere] md:col-auto md:row-auto">
                    {d.what}
                  </td>
                  <td className="col-start-2 row-start-1 self-center md:table-cell md:py-5 md:pr-6 align-top text-[13px] md:text-sm font-bold text-ink-mute whitespace-nowrap md:col-auto md:row-auto">
                    <span className="md:hidden">（</span>{d.mode}<span className="md:hidden">）</span>
                  </td>
                  <td className="col-span-2 md:table-cell md:py-5 align-top text-sm md:text-[15px] text-ink-soft md:whitespace-nowrap md:col-auto">
                    {d.make ? (
                      <>
                        <span className="md:hidden">できる物：</span>
                        {d.make}
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
