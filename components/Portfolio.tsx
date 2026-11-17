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
/* 7つの丸い写真をゆるい弧に並べる時の上下のずれ（絵 curriculum-pc.png の円の中心の高さを測った値・px） */
const ARC = [6, 4, 0, -4, 2, 6, 10];

export const Portfolio: React.FC = () => {
  return (
    <section id={SectionId.Portfolio} className="lp-sec lp-sec-wave relative bg-mist text-ink overflow-x-clip">
      {/* ★2026-11-17 円と曲線の版。正本は designs/lp-creative/sections/curriculum-pc.png。
          淡い水色の地で上下は白の波。7日の写真は丸く切り抜いてゆるい弧に並べ、表は角の大きく丸い白い面に。
          表の右に丸い写真（机の上のノートPC）を表に少し重ね、まわりに円の色面。 */}
      <div aria-hidden="true" className="wave wave-top [--from:#ffffff]" />
      <div aria-hidden="true" className="wave wave-bottom wave-flip [--from:#ffffff]" />
      <span aria-hidden="true" className="dot dot-deep w-24 h-24 lg:w-[124px] lg:h-[124px] -left-6 lg:-left-[10px] top-[56px] opacity-80" />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-[68px] relative z-10">
        <div className="anim-hidden anim-up flex flex-col md:flex-row justify-between items-start gap-3 mb-8 lg:mb-12">
          <h2 className="shrink-0 whitespace-nowrap text-[36px] md:text-5xl lg:text-[56px] xl:text-[68px] leading-[1.2] font-black jp-display text-ink">カリキュラム</h2>
          <p className="jp-text max-w-[30em] md:pt-3 text-base lg:text-[18px] xl:text-[20px] leading-[1.8] text-ink-soft">
            7日間コースの流れです。講義は4回（各90分）で、日程はご相談のうえ決めます。
          </p>
        </div>

        {/* 7日を表す丸い写真（飾り）。PC は横に7つをゆるい弧に、スマホは4つと3つ */}
        <ol className="anim-hidden anim-scale grid grid-cols-4 sm:grid-cols-7 gap-x-3 gap-y-5 sm:gap-x-3 lg:gap-x-4 mb-10 lg:mb-12" aria-hidden="true">
          {SCHEDULE.map((d, i) => (
            <li key={d.day} className="flex flex-col items-center sm:translate-y-[var(--arc)]" style={{ ['--arc' as string]: `${ARC[i]}px` }}>
              <div className="relative w-full max-w-[184px] aspect-square rounded-full overflow-hidden bg-white shadow-card">
                <ImageFrame slot={`schedule.0${i + 1}`} fill density="compact" imgClassName="object-[50%_28%]" />
              </div>
              <span className="mt-2.5 lg:mt-3 text-center font-black text-sm lg:text-[19px] text-brand-700 whitespace-nowrap">{d.day}</span>
            </li>
          ))}
        </ol>

        {/* 7日間の表（日・やること・講義か自習・できる物）を丸みの白い面に。右に丸い写真を重ねる */}
        <div className="relative lg:pr-[22%]">
          <span aria-hidden="true" className="dot hidden lg:block w-[150px] h-[150px] -right-[60px] -top-[10px]" />
          <span aria-hidden="true" className="dot hidden lg:block w-[100px] h-[100px] right-[13.5%] bottom-[-30px]" />
          <div className="anim-hidden anim-up relative z-10 table-blob bg-white shadow-card px-5 sm:px-8 lg:px-12 py-3 sm:py-5">
            <table className="block md:table w-full border-collapse text-left">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-slate-200 text-[15px] text-ink-mute">
                  <th scope="col" className="py-4 pr-6 font-bold whitespace-nowrap">日</th>
                  <th scope="col" className="py-4 pr-6 font-bold">やること</th>
                  <th scope="col" className="py-4 pr-6 font-bold whitespace-nowrap">講義・自習</th>
                  <th scope="col" className="py-4 font-bold whitespace-nowrap">できる物</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {SCHEDULE.map((d, i) => (
                  <tr
                    key={d.day}
                    className={`grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 py-4 md:table-row md:py-0 ${i < SCHEDULE.length - 1 ? 'border-b border-slate-200' : ''}`}
                  >
                    <th scope="row" className="md:table-cell md:py-[22px] md:pr-6 align-top text-base md:text-[18px] font-black text-brand-700 whitespace-nowrap">
                      {d.day}
                    </th>
                    <td className="col-span-2 row-start-2 md:table-cell md:py-[22px] md:pr-6 align-top text-base md:text-[18px] font-bold leading-relaxed text-ink [word-break:keep-all] [overflow-wrap:anywhere] md:col-auto md:row-auto">
                      {d.what}
                    </td>
                    <td className="col-start-2 row-start-1 self-center md:table-cell md:py-[22px] md:pr-6 align-top text-sm md:text-[17px] font-bold text-ink-mute whitespace-nowrap md:col-auto md:row-auto">
                      <span className="md:hidden">（</span>{d.mode}<span className="md:hidden">）</span>
                    </td>
                    <td className="col-span-2 md:table-cell md:py-[22px] align-top text-sm md:text-[17px] text-ink-soft md:col-auto">
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
          {/* 表の右に重ねる丸い写真。スマホは表の下の右に（PC の絵の写真を消さない） */}
          <div className="anim-hidden anim-right relative z-20 ml-auto -mt-10 mr-[-8px] w-[46%] max-w-[220px] aspect-square rounded-full overflow-hidden bg-white shadow-card lg:absolute lg:mt-0 lg:mr-0 lg:max-w-none lg:w-[30%] lg:right-[-5.5%] lg:top-[5%]">
            <ImageFrame slot="curriculum.desk" fill density="compact" />
          </div>
        </div>
      </div>
    </section>
  );
};
