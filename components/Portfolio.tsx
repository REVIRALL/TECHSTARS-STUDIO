import React, { useState, useEffect, useRef } from 'react';
import { SectionId, PortfolioItem } from '../types';
import { ArrowUpRight } from 'lucide-react';
import { ImageFrame } from './ImageFrame';

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
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const active = items.find((i) => i.id === activeId) ?? items[0];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={SectionId.Portfolio}
      className="relative bg-black pt-28 lg:pt-44 pb-24 lg:pb-36 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full section-rule" />
      <div className="absolute inset-0 cyber-grid opacity-[0.18] pointer-events-none" />
      <div className="aurora opacity-40" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className={`flex flex-wrap items-end justify-between gap-4 mb-12 lg:mb-16 anim-hidden anim-up ${isVisible ? 'anim-visible' : ''}`}>
          <div>
            <p className="font-mono text-xs text-brand-500 mb-4 tracking-widest">// CURRICULUM</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-white">
              カリキュラム
            </h2>
          </div>
          <span className="font-mono text-xs glass-card px-3 py-1.5 text-brand-500 border border-brand-500/30">
            // 7日間プログラム
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ===== リスト ===== */}
          <div className="lg:col-span-7">
            <div className="space-y-4 lg:space-y-5">
              {items.map((item, index) => {
                const isActive = item.id === activeId;
                return (
                  <div
                    key={item.id}
                    className={`group relative bg-black border transition-all duration-300 cursor-pointer overflow-hidden anim-hidden anim-left ${
                      isActive ? 'border-brand-500/60' : 'border-slate-800 hover:border-brand-500/40'
                    } ${isVisible ? `anim-visible delay-${index + 1}` : ''}`}
                    onMouseEnter={() => setActiveId(item.id)}
                    onFocus={() => setActiveId(item.id)}
                    tabIndex={0}
                  >
                    {/* ターミナルヘッダー */}
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-600" />
                        <div className="w-2 h-2 rounded-full bg-slate-600" />
                        <div
                          className={`w-2 h-2 rounded-full ${
                            index === items.length - 1 ? 'bg-brand-500 animate-pulse' : 'bg-green-500'
                          }`}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{item.category}</span>
                    </div>

                    {/* モバイル・タブレットでは画像をカード内に直接出す（右のプレビューが無いため） */}
                    <div className="lg:hidden relative border-b border-slate-800">
                      <ImageFrame slot={item.slot} density="compact">
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute inset-0 pointer-events-none scanlines opacity-25" />
                      </ImageFrame>
                    </div>

                    {/* 本文 */}
                    <div className="p-4 md:p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 bg-brand-500 flex items-center justify-center">
                            <span className="font-mono text-xl font-black text-black">0{item.id}</span>
                          </div>
                          {index < items.length - 1 && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-8 bg-gradient-to-b from-brand-500/50 to-transparent" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3
                              className={`text-xl md:text-2xl font-bold transition-colors ${
                                isActive ? 'text-brand-400' : 'text-white group-hover:text-brand-400'
                              }`}
                            >
                              {item.name}
                            </h3>
                            <ArrowUpRight
                              className={`w-5 h-5 text-brand-500 transition-all ${
                                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                              } group-hover:translate-x-1 group-hover:-translate-y-1`}
                            />
                          </div>

                          <div className="font-mono text-xs text-slate-400 bg-slate-900/50 p-3 border-l-2 border-brand-500/30 group-hover:border-brand-500 transition-colors">
                            <span className="text-brand-500">$</span> {item.description}
                          </div>

                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex-1 h-1 bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
                                style={{ width: `${(item.id / items.length) * 100}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] text-slate-500">
                              {Math.round((item.id / items.length) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/5 to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== 追従プレビュー（PCのみ） ===== */}
          <div className={`hidden lg:block lg:col-span-5 relative anim-hidden anim-scale ${isVisible ? 'anim-visible delay-2' : ''}`}>
            <div className="sticky top-32">
              <div className="border border-slate-800 bg-black overflow-hidden">
                {/* ターミナルヘッダー */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="font-mono text-xs text-slate-500">curriculum_preview.exe</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                    <span className="font-mono text-[10px] text-brand-400">LIVE</span>
                  </div>
                </div>

                {/* 画像エリア */}
                <div className="relative">
                  <ImageFrame key={active.slot} slot={active.slot} density="compact">
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute inset-0 pointer-events-none scanlines opacity-30" />

                    {/* コーナーブラケット */}
                    <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-brand-500/70 pointer-events-none" />
                    <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-brand-500/70 pointer-events-none" />
                    <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-brand-500/70 pointer-events-none" />
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-brand-500/70 pointer-events-none" />

                    {/* ラベル */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                      <p className="font-mono text-[10px] text-brand-400 tracking-widest">{active.category}</p>
                      <p className="text-2xl font-black italic tracking-tighter text-white">{active.name}</p>
                    </div>
                  </ImageFrame>
                </div>

                {/* ステータスバー */}
                <div className="px-4 py-3 bg-slate-900/80 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-slate-500">STATUS</span>
                    <span className="font-mono text-[10px] text-green-400">RENDERING</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-mono text-lg font-bold text-white">7</div>
                      <div className="font-mono text-[9px] text-slate-500">DAYS</div>
                    </div>
                    <div>
                      <div className="font-mono text-lg font-bold text-brand-400">4</div>
                      <div className="font-mono text-[9px] text-slate-500">MODULES</div>
                    </div>
                    <div>
                      <div className="font-mono text-lg font-bold text-white">3</div>
                      <div className="font-mono text-[9px] text-slate-500">OUTPUTS</div>
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
