import React, { useState } from 'react';
import { SectionId, PortfolioItem } from '../types';
import { ImageFrame } from './ImageFrame';
import { GenIcon } from './GenIcon';

/**
 * カリキュラム。
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/03-portfolio.png
 *  （左に4つの段のカード・右に選んでいる段の写真の窓。白い地・角丸のカード・水色の差し色）。
 *  1回目の絵は右の写真が「黒髪の男性が画面に向かう横顔」（ユーザーが嫌う定番）になったので描き直させた。
 */

const items: PortfolioItem[] = [
  {
    id: 1,
    name: 'Web制作',
    category: 'Day 1-2',
    description: 'Claude Code環境構築 → LP/ポートフォリオ実装 → レスポンシブ対応 → デプロイ',
    slot: 'curriculum.01',
  },
  {
    id: 2,
    name: '業務自動化',
    category: 'Day 3-4',
    description: 'GAS基礎 → Gmail自動返信 → スプレッドシート集計 → Slack通知連携',
    slot: 'curriculum.02',
  },
  {
    id: 3,
    name: 'バックエンド',
    category: 'Day 5-6',
    description: 'Render + Supabase環境構築 → DB設計 → CRUD実装 → 本番デプロイ',
    slot: 'curriculum.03',
  },
  {
    id: 4,
    name: '卒業',
    category: 'Day 7',
    description: 'ポートフォリオ完成 → 案件獲得講座 → 見積もり実践 → コミュニティ招待',
    slot: 'curriculum.04',
  },
];

export const Portfolio: React.FC = () => {
  const [activeId, setActiveId] = useState<number>(items[0].id);
  const active = items.find((i) => i.id === activeId) ?? items[0];

  return (
    <section id={SectionId.Portfolio} className="lp-sec relative bg-white overflow-hidden">
      <div className="lp-glow opacity-60 [background-position:right_center] [mask-image:linear-gradient(90deg,transparent_35%,#000_100%)]" aria-hidden="true" />

      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <div className="anim-hidden anim-up flex flex-wrap items-end justify-between gap-4 mb-8 lg:mb-12">
          <div>
            <p className="font-mono font-bold text-xs sm:text-sm text-brand-700 mb-4 tracking-[0.3em]">// CURRICULUM</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black jp-display text-ink">カリキュラム</h2>
          </div>
          <span className="font-mono font-bold text-xs sm:text-sm px-4 py-2 rounded-lg border border-brand-200 bg-white/80 text-brand-700">
            // 7日間プログラム
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* ===== リスト ===== */}
          <div className="lg:col-span-7 space-y-4 lg:space-y-5">
            {items.map((item, index) => {
              const isActive = item.id === activeId;
              const pct = Math.round((item.id / items.length) * 100);
              return (
                <div
                  key={item.id}
                  className={`anim-hidden anim-left group relative overflow-hidden rounded-xl bg-white transition-[box-shadow] duration-300 cursor-pointer ${
                    isActive ? 'shadow-lift ring-2 ring-brand-400' : 'shadow-card hover:shadow-lift'
                  }`}
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                  tabIndex={0}
                >
                  {/* 窓の上の帯 */}
                  <div className="flex items-center justify-between px-5 py-2.5 bg-[#F4F8FB]">
                    <div className="flex items-center gap-2" aria-hidden="true">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className={`w-2.5 h-2.5 rounded-full ${index === items.length - 1 ? 'bg-brand-500' : 'bg-slate-300'}`} />
                    </div>
                    <span className="font-mono text-[12px] sm:text-[13px] text-ink-mute">{item.category}</span>
                  </div>

                  {/* モバイル・タブレットでは画像をカード内に直接出す（右のプレビューが無いため） */}
                  <div className="lg:hidden relative aspect-[16/10]">
                    <ImageFrame slot={item.slot} fill density="compact" imgClassName="object-[50%_35%]" />
                  </div>

                  {/* 本文 */}
                  <div className="p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-lg bg-brand-500 flex items-center justify-center">
                        <span className="font-mono text-xl font-black text-ink">0{item.id}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <h3 className={`text-xl md:text-2xl font-black transition-colors ${isActive ? 'text-brand-700' : 'text-ink group-hover:text-brand-700'}`}>
                            {item.name}
                          </h3>
                          <GenIcon
                            name="arrow-up-right"
                            className={`w-6 h-6 transition-all ${
                              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            } group-hover:translate-x-1 group-hover:-translate-y-1`}
                            aria-hidden="true"
                          />
                        </div>

                        {/* 「→」でつないだ段の語（デプロイ・ポートフォリオ実装など）を途中で折らない。空白でだけ折り、入り切らない時だけ途中で折る */}
                        <p className="text-[14px] md:text-[15px] text-ink-soft leading-relaxed [word-break:keep-all] [overflow-wrap:anywhere]">{item.description}</p>

                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-mono text-[12px] text-ink-mute w-10 text-right">{pct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===== 追従プレビュー（PCのみ） ===== */}
          <div className="anim-hidden anim-scale hidden lg:block lg:col-span-5 relative">
            <div className="sticky top-32 overflow-hidden rounded-xl bg-white shadow-lift">
              {/* 窓の上の帯 */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#F4F8FB]">
                <div className="flex items-center gap-2" aria-hidden="true">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <span className="font-mono text-[13px] text-ink-mute">curriculum_preview.exe</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-500 rounded-full" aria-hidden="true" />
                  <span className="font-mono text-[12px] font-bold text-brand-700">LIVE</span>
                </div>
              </div>

              {/* 画像エリア */}
              <div className="relative aspect-[8/7]">
                <ImageFrame slot={active.slot} fill density="compact" imgClassName="object-[50%_30%]">
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6 z-10 pointer-events-none">
                    <p className="font-mono text-[13px] font-bold text-brand-200 tracking-widest">{active.category}</p>
                    <p className="text-3xl font-black jp-display text-white">{active.name}</p>
                  </div>
                </ImageFrame>
              </div>

              {/* ステータスバー */}
              <div className="px-6 pt-4 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[12px] text-ink-mute tracking-widest">STATUS</span>
                  <span className="font-mono text-[12px] font-bold text-brand-700 tracking-widest">RENDERING</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-mono text-2xl font-black text-ink">7</div>
                    <div className="font-mono text-[12px] text-ink-mute tracking-widest">DAYS</div>
                  </div>
                  <div>
                    <div className="font-mono text-2xl font-black text-brand-700">4</div>
                    <div className="font-mono text-[12px] text-ink-mute tracking-widest">MODULES</div>
                  </div>
                  <div>
                    <div className="font-mono text-2xl font-black text-ink">3</div>
                    <div className="font-mono text-[12px] text-ink-mute tracking-widest">OUTPUTS</div>
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
