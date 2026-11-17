import React from 'react';
import { SectionId, TeamMember } from '../types';
import { ImageFrame } from './ImageFrame';
import { GenIcon } from './GenIcon';
import { MAKES, AFTER } from '../content/program';

/**
 * 7日後にできること と 講師陣。
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/06-team.png。
 *  - 講師の写真は実物（/sakamoto.jpg・/numakura.jpg）。六角形の切り抜き・走査線・暗い光は外し、明るいカードに置く。
 *
 * ★2026-11-17 依頼主「// WHY NOW?　こういうのが全部AIっぽい」→
 *  見た目（fix-visual.md）：「// OUTPUT」「// INSTRUCTORS」の札・写真の上の「01」〜「04」・
 *    「READY_TO_LAUNCH」「ACTIVE_MEMBERS」と点・肩書の等幅の書体・浮く動き・写真の拡大・地の光を外した。
 *  文（fix-copy.md）：
 *    #10 説明を「7日間で作る物と、終わったあとに使える物です。」に。4枚（Webサイト制作・業務自動化・案件獲得・
 *        コミュニティ）を「7日間で作る物」3つと「終わったあとに使える物」に分けた。中身は content/program.ts
 *        （料金の7日間コースと FAQ にある物だけ）。「卒業翌週から営業開始可能。」と、どちらにも無い案件獲得の札は外した。
 *        データベースのカードの写真は、前のカリキュラムの「データベースとサーバーを学ぶ場面」（curriculum.03）を使う。
 *    #11 坂本の「AI駆動開発の最前線で実践中」→「AIを使った開発を自社の仕事で続けている」。「2社経営」「創業80期」は変えない。
 *        沼倉の肩書「AIスペシャリスト」は、経歴の文にある事実（本プログラムのカリキュラムを設計）から「講師 / カリキュラム設計」に。
 */

const members: TeamMember[] = [
  {
    id: 1,
    name: '坂本 純一',
    role: '代表 / メイン講師',
    bio: '2社経営の代表取締役。創業80期を迎える老舗企業を率いながら、AIを使った開発を自社の仕事で続けている。',
    image: '/sakamoto.jpg',
  },
  {
    id: 2,
    name: '沼倉 隆平',
    role: '講師 / カリキュラム設計',
    // ★「1000万円クラスの案件を1ヶ月で20本受注」は月間2億円の主張になる。
    //   景表法7条2項の不実証広告規制で、契約書・入金記録による裏付けの提出を
    //   求められて出せない性質の数字なので落とした。裏付けが出せるなら戻してよい。
    bio: 'AI駆動開発の実務家。受託開発の現場でAIを用いた設計・実装・提案を行い、本プログラムのカリキュラムを設計。',
    image: '/numakura.jpg',
  },
];

/** 作る3つの物の写真と印（文は content/program.ts の MAKES） */
const MAKE_LOOK: Record<string, { slot: string; icon: 'layers' | 'settings' | 'database' }> = {
  Webサイト: { slot: 'outcome.01', icon: 'layers' },
  業務の自動化: { slot: 'outcome.02', icon: 'settings' },
  データベースを使うWebアプリ: { slot: 'curriculum.03', icon: 'database' },
};

export const Team: React.FC = () => {
  return (
    <section id={SectionId.Team} className="lp-sec bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        {/* ===== 7日後にできること ===== */}
        <div className="mb-16 lg:mb-24">
          <div className="anim-hidden anim-up mb-8 lg:mb-10">
            <h2 className="text-[28px] md:text-[36px] lg:text-[56px] leading-[1.15] font-black jp-display text-ink mb-4">
              7日後に<span className="text-brand-700">できること</span>
            </h2>
            <p className="text-ink-soft max-w-2xl [word-break:keep-all] [overflow-wrap:anywhere]">7日間で作る物と、終わったあとに使える物です。</p>
          </div>

          <h3 className="anim-hidden anim-up text-xl lg:text-2xl font-black text-ink mb-4 lg:mb-5">7日間で作る物</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-10 lg:mb-14">
            {MAKES.map((m) => {
              const look = MAKE_LOOK[m.name];
              return (
                <article key={m.name} className="anim-hidden anim-up relative rounded-2xl bg-white shadow-card p-2.5 flex flex-col">
                  <div className="relative aspect-[16/11] overflow-hidden rounded-xl">
                    <ImageFrame slot={look.slot} fill density="compact" imgClassName="object-[50%_40%]" />
                    <span className="absolute top-3 left-3 z-10 flex items-center justify-center rounded-lg bg-white/95 p-2 shadow-card">
                      <GenIcon name={look.icon} className="w-6 h-6" />
                    </span>
                  </div>
                  <div className="px-3 pt-5 pb-3 lg:px-4 flex-1 flex flex-col">
                    <p className="text-[13px] font-bold text-brand-700 mb-1">{m.day}の講義</p>
                    <h4 className="text-lg lg:text-xl font-black text-ink mb-2">{m.name}</h4>
                    <p className="text-sm text-ink-soft leading-relaxed flex-1 text-pretty">{m.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <h3 className="anim-hidden anim-up text-xl lg:text-2xl font-black text-ink mb-4 lg:mb-5">終わったあとに使える物</h3>
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            {AFTER.map((a) => (
              <div key={a.name} className="anim-hidden anim-up flex items-start gap-4 rounded-2xl bg-mist p-5 lg:p-6">
                <span className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-card">
                  <GenIcon name={a.icon} className="w-7 h-7" />
                </span>
                <div>
                  <h4 className="text-base lg:text-lg font-black text-ink mb-1.5">{a.name}</h4>
                  <p className="text-sm text-ink-soft leading-relaxed text-pretty">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 講師陣 =====（ナビの「講師陣」はここ #instructors へ飛ぶ。区画の頭は「7日後にできること」なので） */}
        <div id="instructors" className="relative">
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
