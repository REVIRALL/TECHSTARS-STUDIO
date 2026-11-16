import React from 'react';
import { SectionId } from '../types';
import { ImageFrame } from './ImageFrame';

/**
 * 学習スケジュール。
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/04-process.png
 *  （上に7日を表す7枚の写真の帯＋DAY の字、下に白いカードで7日分の一覧と進み具合）。
 *  - 前の暗い「光の柱」の帯の絵は、7枚の人物の写真（schedule.01〜07）に替えた。
 *    1回目の絵は7枚とも同じ黒髪の若い男性がパソコンに向かう写真になったので、別の人・別の場面で描き直させた。
 *  - 一覧の左に引いていた縦の線（時間の線）は外した（一覧の左に色の縦線を引かない・絵にも無い）。
 *  - スマホは7枚を1行に詰めると1枚50px になるので、4枚＋3枚の2段にする（写真は消さない）。
 */

const DAYS = [
  { step: 'DAY 01', title: 'IGNITE', desc: 'Claude Code環境構築。AIに「LP作って」と言うだけでコードが出る体験', time: '90分', active: true },
  { step: 'DAY 02', title: 'CREATE', desc: '自分のポートフォリオサイトを実装。レスポンシブ対応まで完了', time: '自習', active: true },
  { step: 'DAY 03', title: 'AUTOMATE', desc: 'GASでGmail自動返信、スプレッドシート集計を実装。明日から業務で使える', time: '60分', active: true },
  { step: 'DAY 04', title: 'BUILD', desc: '日報自動生成ツールを完成。Slack通知まで実装', time: '自習', active: true },
  { step: 'DAY 05', title: 'CONNECT', desc: 'Render + Supabaseでバックエンド構築。DB連携アプリの土台を作る', time: '90分', active: false },
  { step: 'DAY 06', title: 'DEPLOY', desc: 'CRUD機能を持つWebアプリを本番デプロイ。URLを共有できる状態に', time: '自習', active: false },
  { step: 'DAY 07', title: 'LAUNCH', desc: 'ポートフォリオ完成、案件獲得方法の講義、コミュニティ招待', time: '90分', active: false },
];

export const Process: React.FC = () => {
  return (
    <section id={SectionId.Process} className="lp-sec relative bg-mist text-ink overflow-hidden">
      <div className="lp-glow opacity-70 [background-position:center_top] [mask-image:linear-gradient(180deg,#000_0%,transparent_30%)]" aria-hidden="true" />

      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <div className="anim-hidden anim-up flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-8 lg:mb-10">
          <div>
            <p className="font-mono font-bold text-xs sm:text-sm text-brand-700 mb-4 tracking-[0.3em]">// SCHEDULE</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black jp-display text-ink">学習スケジュール</h2>
          </div>
          <span className="font-mono font-bold text-xs sm:text-sm text-brand-700 md:mb-2">// 7日間の流れ</span>
        </div>

        {/* 7日を表す写真の帯 */}
        <div className="anim-hidden anim-scale mb-6 lg:mb-8 rounded-2xl bg-white shadow-card p-2 sm:p-3">
          <ol className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-1">
            {DAYS.map((d, i) => (
              <li key={d.step} className="flex flex-col">
                <div className={`relative aspect-[4/7] overflow-hidden ${i === 0 ? 'sm:rounded-l-xl' : ''} ${i === DAYS.length - 1 ? 'sm:rounded-r-xl' : ''} rounded-lg sm:rounded-none`}>
                  <ImageFrame slot={`schedule.0${i + 1}`} fill density="compact" imgClassName="object-[50%_30%]" />
                </div>
                <span className="mt-2 mb-1 text-center font-mono font-bold text-[12px] tracking-[0.18em] text-brand-700">
                  {d.step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* 7日分の一覧 */}
        <div className="anim-hidden anim-up rounded-2xl bg-white shadow-card px-5 sm:px-8 lg:px-10 py-3 sm:py-5">
          <ol>
            {DAYS.map((item, idx) => (
              <li
                key={item.step}
                className={`group flex items-start gap-4 sm:gap-6 py-5 sm:py-6 ${idx < DAYS.length - 1 ? 'border-b border-slate-200' : ''}`}
              >
                {/* 状態の丸 */}
                <span className="relative mt-1.5 sm:mt-3 w-6 h-6 shrink-0 flex items-center justify-center" aria-hidden="true">
                  <span
                    className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                      item.active ? 'bg-brand-500 ring-4 ring-brand-100' : 'bg-slate-300 group-hover:bg-brand-400'
                    }`}
                  />
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-4 sm:gap-x-6 gap-y-1 mb-1.5">
                    <span className={`font-mono font-bold text-[12px] tracking-[0.2em] ${item.active ? 'text-brand-700' : 'text-slate-500'}`}>
                      {item.step}
                    </span>
                    <span
                      className={`text-2xl md:text-3xl lg:text-[2.5rem] font-black tracking-[-0.02em] transition-colors duration-300 ${
                        item.active ? 'text-ink' : 'text-slate-500 group-hover:text-ink'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[13px] text-ink-mute">{item.time}</span>
                  </div>
                  <p className={`text-sm sm:text-[15px] leading-relaxed max-w-2xl text-pretty ${item.active ? 'text-ink-soft' : 'text-slate-500'}`}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* 進み具合 */}
          <div className="pt-5 pb-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono text-ink-mute">Progress</span>
              <span className="font-mono font-bold text-brand-700">4/7 DAYS</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden mt-2.5">
              <div className="h-full bg-gradient-to-r from-brand-400 to-brand-500 w-[57%] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
