import React, { useState } from 'react';
import { SectionId, PortfolioItem } from '../types';
import { ImageFrame } from './ImageFrame';

/**
 * カリキュラム。
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/03-portfolio.png
 *  （左に4つの段のカード・右に選んでいる段の写真の窓。白い地・角丸のカード・水色の差し色）。
 *  1回目の絵は右の写真が「黒髪の男性が画面に向かう横顔」（ユーザーが嫌う定番）になったので描き直させた。
 *
 * ★2026-11-17 依頼主「// WHY NOW?　こういうのが全部AIっぽい」→ 見た目だけ直した（文は変えていない）。
 *  - 「// CURRICULUM」「// 7日間プログラム」の札、カードの上の帯（色の丸3つ）、「01」〜「04」の札、
 *    進み具合の棒と %、押しても飛ばない外へ出る矢印を外した。
 *  - 右の窓は「curriculum_preview.exe」・赤黄緑の丸・「LIVE」と下の「STATUS／RENDERING／7 DAYS…」を外し、写真だけ残した。
 *  - 日付は「1〜2日目」の形にそろえ、普通の書体で見出しの上に置く。地のぼかした写真の光も外した。
 */

const items: PortfolioItem[] = [
  {
    id: 1,
    name: 'Web制作',
    category: '1〜2日目',
    description: 'Claude Code環境構築 → LP/ポートフォリオ実装 → レスポンシブ対応 → デプロイ',
    slot: 'curriculum.01',
  },
  {
    id: 2,
    name: '業務自動化',
    category: '3〜4日目',
    description: 'GAS基礎 → Gmail自動返信 → スプレッドシート集計 → Slack通知連携',
    slot: 'curriculum.02',
  },
  {
    id: 3,
    name: 'バックエンド',
    category: '5〜6日目',
    description: 'Render + Supabase環境構築 → DB設計 → CRUD実装 → 本番デプロイ',
    slot: 'curriculum.03',
  },
  {
    id: 4,
    name: '卒業',
    category: '7日目',
    description: 'ポートフォリオ完成 → 案件獲得講座 → 見積もり実践 → コミュニティ招待',
    slot: 'curriculum.04',
  },
];

export const Portfolio: React.FC = () => {
  const [activeId, setActiveId] = useState<number>(items[0].id);
  const active = items.find((i) => i.id === activeId) ?? items[0];

  return (
    <section id={SectionId.Portfolio} className="lp-sec relative bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <div className="anim-hidden anim-up mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black jp-display text-ink">カリキュラム</h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* ===== リスト ===== */}
          <div className="lg:col-span-7 space-y-4 lg:space-y-5">
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <div
                  key={item.id}
                  className={`anim-hidden anim-left relative overflow-hidden rounded-xl bg-white transition-[box-shadow] duration-300 cursor-pointer ${
                    isActive ? 'shadow-lift ring-2 ring-brand-400' : 'shadow-card'
                  }`}
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                  tabIndex={0}
                >
                  {/* モバイル・タブレットでは画像をカード内に直接出す（右のプレビューが無いため） */}
                  <div className="lg:hidden relative aspect-[16/10]">
                    <ImageFrame slot={item.slot} fill density="compact" imgClassName="object-[50%_35%]" />
                  </div>

                  {/* 本文 */}
                  <div className="p-5 md:px-7 md:py-6">
                    <p className="text-[13px] sm:text-sm font-bold text-brand-700 mb-1">{item.category}</p>
                    <h3 className={`text-xl md:text-2xl font-black mb-2 transition-colors ${isActive ? 'text-brand-700' : 'text-ink'}`}>
                      {item.name}
                    </h3>
                    {/* 「→」でつないだ段の語（デプロイ・ポートフォリオ実装など）を途中で折らない。空白でだけ折り、入り切らない時だけ途中で折る */}
                    <p className="text-[14px] md:text-[15px] text-ink-soft leading-relaxed [word-break:keep-all] [overflow-wrap:anywhere]">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===== 追従プレビュー（PCのみ）。写真だけ ===== */}
          <div className="anim-hidden anim-scale hidden lg:block lg:col-span-5 relative">
            <div className="sticky top-32 overflow-hidden rounded-xl bg-white shadow-lift">
              <div className="relative aspect-[8/7]">
                <ImageFrame slot={active.slot} fill density="compact" imgClassName="object-[50%_30%]">
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6 z-10 pointer-events-none">
                    <p className="text-sm font-bold text-white">{active.category}</p>
                    <p className="text-3xl font-black jp-display text-white">{active.name}</p>
                  </div>
                </ImageFrame>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
