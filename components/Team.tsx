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

/** 作る3つの物の写真と印（文は content/program.ts の MAKES）。
 *  ★2026-11-17 円と曲線の版：写真は区画の絵（designs/lp-creative/sections/outcomes-pc.png）の丸い写真に合わせて描き直した物 */
const MAKE_LOOK: Record<string, { slot: string; icon: 'layers' | 'settings' | 'database' }> = {
  Webサイト: { slot: 'outcome.web', icon: 'layers' },
  業務の自動化: { slot: 'outcome.02', icon: 'settings' },
  データベースを使うWebアプリ: { slot: 'outcome.app', icon: 'database' },
};

/** 終わったあとに使える物の丸い写真（文と印は content/program.ts の AFTER） */
const AFTER_SLOT: Record<string, string> = {
  卒業生のコミュニティ: 'after.community',
  LMSの教材: 'after.lms',
  学習サポートツール: 'model.ai',
};

export const Team: React.FC = () => {
  return (
    <section id={SectionId.Team} className="relative overflow-x-clip">
      {/* ★2026-11-17 円と曲線の版。正本は designs/lp-creative/sections/outcomes-pc.png・outcomes-sp.png・instructors-pc.png。
          7日後にできること：白い地。左に作る3つを大きな丸い写真で、右に終わったあとに使える3つを小さめの丸い写真で並べ、
          写真の左上に丸い地の印。2つの組の間は余白で分ける（線を引かない）。右上に大きな円の色面。
          講師陣：淡い水色の地で上下は波。2人を大きな円の写真にし、後ろに円の色面を少しずらして重ねる（写真は実物のまま）。 */}

      {/* ===== 7日後にできること ===== */}
      <div className="lp-sec lp-sec-wave relative bg-white">
        <div aria-hidden="true" className="wave wave-top wave-flip [--from:#EDF8FD]" />
        <div aria-hidden="true" className="wave wave-bottom [--from:#EDF8FD]" />
        <span aria-hidden="true" className="dot w-28 h-28 lg:w-[240px] lg:h-[240px] -right-10 lg:-right-[40px] top-[84px] lg:top-[130px]" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-[50px] relative z-10">
          <div className="anim-hidden anim-up mb-10 lg:mb-14">
            <h2 className="text-[34px] md:text-5xl lg:text-[60px] xl:text-[64px] leading-[1.2] font-black jp-display text-ink mb-3 lg:mb-4">
              7日後に<span className="text-brand-700">できること</span>
            </h2>
            <p className="text-base lg:text-[20px] text-ink-soft [word-break:keep-all] [overflow-wrap:anywhere]">7日間で作る物と、終わったあとに使える物です。</p>
          </div>

          <div className="grid xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-x-8 gap-y-14">
            {/* 7日間で作る物 */}
            <div>
              <h3 className="anim-hidden anim-up text-2xl lg:text-[30px] font-black text-ink mb-6 lg:mb-8">7日間で作る<span className="text-brand-700">物</span></h3>
              <div className="grid sm:grid-cols-3 gap-x-5 xl:gap-x-6 gap-y-9">
                {MAKES.map((m) => {
                  const look = MAKE_LOOK[m.name];
                  return (
                    <article key={m.name} className="anim-hidden anim-up grid grid-cols-[clamp(120px,38vw,150px)_minmax(0,1fr)] sm:grid-cols-1 gap-x-5 items-center sm:items-start sm:content-start">
                      <div className="relative w-full max-w-[240px] aspect-square">
                        <div className="absolute inset-0 rounded-full overflow-hidden bg-mist">
                          <ImageFrame slot={look.slot} fill density="compact" />
                        </div>
                        <span className="absolute left-0 top-0 z-10 flex items-center justify-center w-11 h-11 lg:w-[72px] lg:h-[72px] rounded-full bg-[#E3F6FE] shadow-card">
                          <GenIcon name={look.icon} className="w-6 h-6 lg:w-9 lg:h-9" />
                        </span>
                      </div>
                      <div className="sm:mt-6">
                        <p className="text-[15px] lg:text-[17px] font-black text-brand-700 mb-1">{m.day}の講義</p>
                        <h4 className="jp-phrase text-xl lg:text-[20px] xl:text-[22px] font-black text-ink leading-snug mb-2.5">{m.name}</h4>
                        <p className="jp-text text-[15px] lg:text-[15px] xl:text-[16px] text-ink-soft leading-[1.75]">{m.desc}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* 終わったあとに使える物 */}
            <div>
              <h3 className="anim-hidden anim-up text-2xl lg:text-[30px] font-black text-ink lg:text-brand-700 mb-6 lg:mb-8">終わったあとに使える<span className="text-brand-700">物</span></h3>
              <div className="grid sm:grid-cols-3 gap-x-5 xl:gap-x-4 gap-y-8 xl:pt-6">
                {AFTER.map((a) => (
                  <div key={a.name} className="anim-hidden anim-up grid grid-cols-[clamp(100px,30vw,120px)_minmax(0,1fr)] sm:grid-cols-1 gap-x-5 items-center sm:items-start sm:content-start">
                    <div className="relative w-full max-w-[190px] aspect-square">
                      <div className="absolute inset-0 rounded-full overflow-hidden bg-mist">
                        <ImageFrame slot={AFTER_SLOT[a.name]} fill density="compact" />
                      </div>
                      <span className="absolute left-0 top-0 z-10 flex items-center justify-center w-11 h-11 lg:w-[60px] lg:h-[60px] rounded-full bg-[#E3F6FE] shadow-card">
                        <GenIcon name={a.icon} className="w-6 h-6 lg:w-8 lg:h-8" />
                      </span>
                    </div>
                    <div className="sm:mt-5">
                      <h4 className="jp-phrase text-[17px] min-[375px]:text-lg lg:text-[19px] xl:text-[17px] font-black text-ink mb-2">{a.name}</h4>
                      <p className="jp-text text-[15px] xl:text-[14px] text-ink-soft leading-[1.75]">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 講師陣 =====（ナビの「講師陣」はここ #instructors へ飛ぶ） */}
      <div id="instructors" className="lp-sec lp-sec-wave relative bg-mist">
        <div aria-hidden="true" className="wave wave-bottom wave-flip [--from:#ffffff]" />
        <span aria-hidden="true" className="dot w-16 h-16 lg:w-[110px] lg:h-[110px] left-[4%] lg:left-[8%] bottom-[120px] lg:bottom-[150px]" />
        <span aria-hidden="true" className="dot hidden lg:block w-[30px] h-[30px] left-[14.6%] bottom-[290px]" />
        <span aria-hidden="true" className="dot w-24 h-24 lg:w-[140px] lg:h-[140px] -right-8 lg:-right-[40px] bottom-[40px] lg:bottom-[30px]" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-[82px] relative z-10 grid lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] gap-x-8 gap-y-10 items-start">
          <h2 className="anim-hidden anim-left text-[36px] md:text-5xl lg:text-[60px] xl:text-[64px] font-black jp-display text-ink lg:pt-[70px]">講師陣</h2>

          <div className="grid md:grid-cols-2 gap-x-10 xl:gap-x-[120px] gap-y-14">
            {members.map((member) => (
              <div key={member.id} className="anim-hidden anim-scale relative flex flex-col">
                <div className="relative w-[78%] sm:w-[62%] md:w-[76%] max-w-[340px] aspect-square">
                  {/* 後ろに少しずらして重ねる円の色面 */}
                  <span aria-hidden="true" className="absolute w-[66%] aspect-square rounded-full bg-bubble -right-[18%] -top-[8%]" />
                  <div className="absolute inset-0 rounded-full overflow-hidden bg-slate-100 shadow-card">
                    <img
                      src={member.image}
                      alt={`${member.name}の写真`}
                      loading="lazy"
                      className="w-full h-full object-cover object-[50%_22%]"
                    />
                  </div>
                </div>

                <div className="mt-5 lg:mt-6">
                  <p className="font-black text-[15px] lg:text-base text-brand-700 mb-1">{member.role}</p>
                  <h3 className="text-[26px] lg:text-[30px] font-black text-ink mb-3">{member.name}</h3>
                  {/* hover 依存だとタッチ端末で経歴が読めないので常時表示にする */}
                  <p className="jp-body jp-text text-[15px] lg:text-[17px] leading-[1.8] text-ink-soft max-w-[26em]">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
