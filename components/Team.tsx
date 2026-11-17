import React from 'react';
import { SectionId, TeamMember } from '../types';
import { ImageFrame } from './ImageFrame';
import { GenIcon } from './GenIcon';

/**
 * 7日後にできること と 講師陣。
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/06-team.png。
 *  - できることの4枚は、上に明るい人物・手元の写真（outcome.01〜04）と白い札（線のアイコン＋番号）、下に見出し・説明・札。
 *    札のアイコンは絵と同じ形（重なった板・歯車・かばん・人）。
 *    札の上に引いていた区切りの線は外した（絵にも無い）。
 *  - 講師の写真は実物（/sakamoto.jpg・/numakura.jpg）。六角形の切り抜き・走査線・暗い光は外し、明るいカードに置く。
 *
 * ★2026-11-17 依頼主「// WHY NOW?　こういうのが全部AIっぽい」→ 見た目だけ直した。
 *  - 「// OUTPUT」「// INSTRUCTORS」の札、写真の上の白い札の「01」〜「04」（印は残す）、
 *    「READY_TO_LAUNCH」「ACTIVE_MEMBERS」と点つきの札を外した。
 *  - 「HTML / CSS / JS」「GMAIL / GAS / SLACK」は「使う物：HTML・CSS・JavaScript」「使う物：Gmail・GAS・Slack」を普通の字で。
 *  - 講師の肩書は等幅・字間の広い書体をやめ、普通の書体に。カードの浮く動き・写真の拡大、地のぼかした写真の光を外した。
 */

const members: TeamMember[] = [
  {
    id: 1,
    name: '坂本 純一',
    role: '代表 / メイン講師',
    bio: '2社経営の代表取締役。創業80期を迎える老舗企業を率いながら、AI駆動開発の最前線で実践中。',
    image: '/sakamoto.jpg',
  },
  {
    id: 2,
    name: '沼倉 隆平',
    role: 'AIスペシャリスト',
    // ★「1000万円クラスの案件を1ヶ月で20本受注」は月間2億円の主張になる。
    //   景表法7条2項の不実証広告規制で、契約書・入金記録による裏付けの提出を
    //   求められて出せない性質の数字なので落とした。裏付けが出せるなら戻してよい。
    bio: 'AI駆動開発の実務家。受託開発の現場でAIを用いた設計・実装・提案を行い、本プログラムのカリキュラムを設計。',
    image: '/numakura.jpg',
  },
];

const outcomes: { slot: string; icon: 'layers' | 'settings' | 'briefcase' | 'users'; title: string; desc: string; meta?: string }[] = [
  {
    slot: 'outcome.01',
    icon: 'layers' as const,
    title: 'Webサイト制作',
    desc: 'LP、ポートフォリオを0から実装できる。レスポンシブ対応、SEO基礎も含む。',
    meta: '使う物：HTML・CSS・JavaScript',
  },
  {
    slot: 'outcome.02',
    icon: 'settings' as const,
    title: '業務自動化',
    desc: 'GASでGmail自動返信、スプレッドシート集計、Slack通知を構築できる。',
    meta: '使う物：Gmail・GAS・Slack',
  },
  {
    slot: 'outcome.03',
    icon: 'briefcase' as const,
    title: '案件獲得',
    desc: '見積もりの出し方、提案書テンプレートを提供。卒業翌週から営業開始可能。',
  },
  {
    slot: 'outcome.04',
    icon: 'users' as const,
    title: 'コミュニティ',
    desc: '卒業生Slackに招待。案件情報、技術相談、勉強会の案内を共有。',
  },
];

export const Team: React.FC = () => {
  return (
    <section id={SectionId.Team} className="lp-sec bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        {/* ===== 受講後のあなた ===== */}
        <div className="mb-16 lg:mb-24">
          <div className="anim-hidden anim-up mb-8 lg:mb-10">
            <h2 className="text-[28px] md:text-[36px] lg:text-[56px] leading-[1.15] font-black jp-display text-ink mb-4">
              7日後に<span className="text-brand-700">できること</span>
            </h2>
            <p className="text-ink-soft max-w-2xl">具体的に何ができるようになるか。曖昧な約束はしない。</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {outcomes.map((item) => (
              <article
                key={item.slot}
                className="anim-hidden anim-up relative rounded-2xl bg-white shadow-card p-2.5 flex flex-col"
              >
                <div className="relative aspect-[20/21] overflow-hidden rounded-xl">
                  <ImageFrame slot={item.slot} fill density="compact" />
                  <span className="absolute top-3 left-3 z-10 flex items-center justify-center rounded-lg bg-white/95 p-2 shadow-card">
                    <GenIcon name={item.icon} className="w-6 h-6" />
                  </span>
                </div>

                <div className="px-3 pt-5 pb-3 lg:px-4 flex-1 flex flex-col">
                  <h3 className="text-lg lg:text-xl font-black text-ink mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed flex-1 text-pretty">{item.desc}</p>
                  {item.meta && <p className="mt-4 text-[13px] font-bold text-ink-mute">{item.meta}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ===== 講師陣 ===== */}
        <div className="relative">
          <div className="anim-hidden anim-left mb-8 lg:mb-10">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black jp-display text-ink">講師陣</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6 max-w-[1160px] mx-auto">
            {members.map((member) => (
              <div
                key={member.id}
                className="anim-hidden anim-scale relative rounded-2xl bg-white shadow-card p-2.5 flex flex-col"
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={member.image}
                    alt={`${member.name}の写真`}
                    loading="lazy"
                    className="w-full h-full object-cover object-[50%_22%]"
                  />
                </div>

                <div className="px-4 pt-5 pb-4 lg:px-5">
                  <p className="font-bold text-sm text-brand-700 mb-1">{member.role}</p>
                  <h3 className="text-xl lg:text-2xl font-black text-ink mb-3">{member.name}</h3>
                  {/* hover 依存だとタッチ端末で経歴が読めないので常時表示にする */}
                  <p className="jp-body text-[14px] text-ink-soft text-pretty">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
