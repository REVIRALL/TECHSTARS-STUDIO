import React, { useEffect, useRef, useState } from 'react';
import { SectionId, TeamMember } from '../types';
import { Code, Briefcase, Rocket, Users } from 'lucide-react';
import { ImageFrame } from './ImageFrame';
import { Icon } from './Icon';

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
    bio: 'AI×開発のスペシャリスト。1000万円クラスの案件を1ヶ月で20本受注した超実践派。',
    image: '/numakura.jpg',
  },
];

const outcomes = [
  {
    slot: 'outcome.01',
    no: '01',
    Icon: Code,
    iconSlot: 'icon.web',
    title: 'Webサイト制作',
    desc: 'LP、ポートフォリオを0から実装できる。レスポンシブ対応、SEO基礎も含む。',
    meta: 'HTML / CSS / JS',
  },
  {
    slot: 'outcome.02',
    no: '02',
    Icon: Rocket,
    iconSlot: 'icon.automation',
    title: '業務自動化',
    desc: 'GASでGmail自動返信、スプレッドシート集計、Slack通知を構築できる。',
    meta: 'GMAIL / GAS / SLACK',
  },
  {
    slot: 'outcome.03',
    no: '03',
    Icon: Briefcase,
    iconSlot: 'icon.client',
    title: '案件獲得',
    desc: '見積もりの出し方、提案書テンプレートを提供。卒業翌週から営業開始可能。',
    meta: 'READY_TO_LAUNCH',
  },
  {
    slot: 'outcome.04',
    no: '04',
    Icon: Users,
    iconSlot: 'icon.community',
    title: 'コミュニティ',
    desc: '卒業生Slackに招待。案件情報、技術相談、勉強会の案内を共有。',
    meta: 'ACTIVE_MEMBERS',
  },
];

export const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={SectionId.Team}
      className="pt-28 lg:pt-44 pb-24 lg:pb-36 bg-black relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full section-rule" />
      <div className="absolute inset-0 cyber-grid opacity-[0.18] pointer-events-none" />
      <div className="aurora opacity-40" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        {/* ===== 受講後のあなた ===== */}
        <div className="mb-24 lg:mb-36">
          <div className={`mb-12 anim-hidden anim-up ${isVisible ? 'anim-visible' : ''}`}>
            <p className="font-mono text-xs text-brand-500 mb-4 tracking-widest">// OUTPUT</p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black jp-display text-white mb-4">
              7日後に<span className="text-brand-500">できること</span>
            </h2>
            <p className="text-slate-400 max-w-2xl">具体的に何ができるようになるか。曖昧な約束はしない。</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {outcomes.map((item, idx) => (
              <article
                key={item.slot}
                className={`group relative bg-[#07080c] border border-slate-800 hover:border-brand-500/60 frame-glow overflow-hidden flex flex-col anim-hidden anim-up ${
                  isVisible ? `anim-visible delay-${idx + 1}` : ''
                }`}
              >
                <div className="relative">
                  <ImageFrame
                    slot={item.slot}
                    density="compact"
                    imgClassName="group-hover:scale-[1.06] transition-transform duration-[900ms] ease-out"
                  >
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#07080c] via-transparent to-transparent" />
                    <div className="absolute inset-0 pointer-events-none scanlines opacity-25" />
                  </ImageFrame>

                  {/* 立体アイコン。画像が無い間は lucide の線アイコンに戻る */}
                  <span className="absolute top-3 left-3 z-10 flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-12 h-12 text-brand-500">
                      <Icon slot={item.iconSlot} fallback={item.Icon} size={48} className="text-brand-500" />
                    </span>
                    <span className="font-mono text-[10px] text-brand-400 tracking-widest">{item.no}</span>
                  </span>
                </div>

                <div className="p-5 lg:p-6 flex-1 flex flex-col">
                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">{item.desc}</p>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                    <span className="font-mono text-[10px] text-slate-500 tracking-widest">{item.meta}</span>
                  </div>
                </div>

                <span className="absolute bottom-0 left-0 h-[2px] bg-brand-500 w-0 group-hover:w-full transition-all duration-500" />
              </article>
            ))}
          </div>
        </div>

        {/* ===== 講師陣 ===== */}
        <div className="relative">
          {/* 背景の光。講師カードを舞台の上に立たせる */}
          <div className="absolute -inset-x-6 lg:-inset-x-12 -top-20 h-[520px] pointer-events-none">
            <ImageFrame
              slot="team.backdrop"
              fill
              density="compact"
              imgClassName="opacity-40 edge-fade"
              placeholderClassName="opacity-25"
              chipPosition="top-2 right-6"
            />
          </div>

          <div className="relative z-10">
            <div className={`mb-12 md:mb-16 anim-hidden anim-left ${isVisible ? 'anim-visible delay-5' : ''}`}>
              <p className="font-mono text-xs text-brand-500 mb-4 tracking-widest">// INSTRUCTORS</p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black jp-display text-white">
                講師陣
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className={`group relative glass-card min-h-[360px] sm:min-h-[400px] md:min-h-[480px] lg:min-h-[520px] p-6 flex flex-col justify-end overflow-hidden holographic anim-hidden anim-scale ${
                    isVisible ? `anim-visible delay-${index + 2}` : ''
                  }`}
                >
                  <div className="absolute inset-4">
                    <div className="hex-profile w-full h-full overflow-hidden">
                      <img
                        src={member.image}
                        alt={`${member.name}の写真`}
                        loading="lazy"
                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>

                  <div
                    className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-0 transition-opacity scanlines"
                  />

                  <div className="relative z-10">
                    <p className="font-mono text-xs text-brand-500 mb-1">{member.role}</p>
                    <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                    {/* hover 依存だとタッチ端末で経歴が読めないので常時表示にする */}
                    <p className="jp-body text-[13px] text-slate-300 mt-3 pt-3 border-t border-white/15">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
