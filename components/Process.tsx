import React, { useEffect, useRef, useState } from 'react';
import { SectionId } from '../types';
import { ImageFrame } from './ImageFrame';

export const Process: React.FC = () => {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id={SectionId.Process} className="relative bg-black text-white pt-28 lg:pt-44 pb-28 lg:pb-44 overflow-hidden">
      {/* 上部の水平ネオンライン（セクション区切り） */}
      <div className="absolute top-0 left-0 w-full section-rule"></div>

      {/* Cyber Grid Background - 視認性向上 */}
      <div className="absolute inset-0 cyber-grid opacity-[0.18] pointer-events-none"></div>
      <div className="aurora opacity-40"></div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 lg:mb-16 border-b border-slate-800 pb-8 anim-hidden anim-up ${isVisible ? 'anim-visible' : ''}`}>
           <div>
             <p className="font-mono text-xs text-brand-500 mb-4 tracking-widest">// SCHEDULE</p>
             <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
               学習スケジュール
             </h2>
           </div>
           <span className="font-mono text-xs text-brand-500 mb-2">
             // 7日間の流れ
           </span>
        </div>

        {/* 7日間の光の帯。日を追うごとに光が強くなる＝進捗そのものを絵にする。
            高さを固定して fill で敷く。生成した画像の縦横比が多少ぶれても、
            柱の根元と床の反射（一番効く部分）が残るように object-position を下寄りにしている */}
        <div className={`relative h-[220px] sm:h-[300px] lg:h-[380px] mb-8 lg:mb-12 overflow-hidden border border-white/10 anim-hidden anim-scale ${isVisible ? 'anim-visible delay-1' : ''}`}>
          <ImageFrame
            slot="process.banner"
            fill
            density="compact"
            imgClassName="object-[50%_65%] edge-fade-bottom"
            chipPosition="top-3 right-3"
          >
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-black/25 to-black/60" />
            <div className="absolute inset-0 pointer-events-none scanlines opacity-25" />
            <div className="absolute inset-x-0 bottom-0 z-10 flex justify-between px-4 sm:px-8 pb-3 pointer-events-none">
              {['DAY 01', 'DAY 02', 'DAY 03', 'DAY 04', 'DAY 05', 'DAY 06', 'DAY 07'].map((d, i) => (
                <span
                  key={d}
                  className="font-mono text-[8px] sm:text-[10px] tracking-widest"
                  style={{ color: `rgba(0, 229, 255, ${0.35 + i * 0.1})` }}
                >
                  {d}
                </span>
              ))}
            </div>
          </ImageFrame>
        </div>

        {/* Vertical Neon Line Pattern */}
        <div className="relative p-6 sm:p-8 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          {/* Vertical timeline line */}
          <div className="absolute left-10 sm:left-12 md:left-16 top-0 bottom-0 w-[2px] bg-slate-800"></div>
          <div className="absolute left-10 sm:left-12 md:left-16 top-0 h-[calc(100%*4/7)] w-[2px] bg-gradient-to-b from-brand-500 to-brand-500/30 shadow-[0_0_10px_var(--brand)]"></div>

          <div className="space-y-8 relative z-10">
            {[
              { step: 'DAY 01', title: 'IGNITE', desc: 'Claude Code環境構築。AIに「LP作って」と言うだけでコードが出る体験', type: 'lecture', time: '90分', active: true },
              { step: 'DAY 02', title: 'CREATE', desc: '自分のポートフォリオサイトを実装。レスポンシブ対応まで完了', type: 'practice', time: '自習', active: true },
              { step: 'DAY 03', title: 'AUTOMATE', desc: 'GASでGmail自動返信、スプレッドシート集計を実装。明日から業務で使える', type: 'lecture', time: '60分', active: true },
              { step: 'DAY 04', title: 'BUILD', desc: '日報自動生成ツールを完成。Slack通知まで実装', type: 'practice', time: '自習', active: true },
              { step: 'DAY 05', title: 'CONNECT', desc: 'Render + Supabaseでバックエンド構築。DB連携アプリの土台を作る', type: 'lecture', time: '90分', active: false },
              { step: 'DAY 06', title: 'DEPLOY', desc: 'CRUD機能を持つWebアプリを本番デプロイ。URLを共有できる状態に', type: 'practice', time: '自習', active: false },
              { step: 'DAY 07', title: 'LAUNCH', desc: 'ポートフォリオ完成、案件獲得方法の講義、コミュニティ招待', type: 'lecture', time: '90分', active: false },
            ].map((item, idx) => (
              <div key={idx} className={`flex items-start gap-6 group anim-hidden anim-left ${isVisible ? `anim-visible delay-${Math.min(idx + 1, 6)}` : ''}`}>
                {/* Timeline Dot */}
                <div className={`relative w-8 h-8 flex items-center justify-center shrink-0 ${item.active ? 'mt-2' : 'mt-1'}`}>
                  <div className={`w-4 h-4 rounded-full ${item.active ? 'bg-brand-500 shadow-[0_0_15px_var(--brand)]' : 'bg-slate-600 group-hover:bg-brand-500'} transition-all duration-300 ${item.active ? 'timeline-dot' : ''}`}></div>
                </div>

                {/* Content — 状態はドットと文字の明度だけで示す。囲みも縦線も置かない */}
                <div className="flex-1 pb-7 md:pb-8">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                    <h4 className={`font-mono text-[11px] tracking-[0.2em] ${item.active ? 'text-brand-500' : 'text-slate-600 group-hover:text-brand-400'} transition-colors`}>
                      {item.step}
                    </h4>
                    <p className={`text-2xl md:text-3xl lg:text-[2.5rem] font-black tracking-[-0.03em] ${item.active ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors duration-300`}>
                      {item.title}
                    </p>
                    <span className={`text-[11px] ${item.active ? 'text-slate-400' : 'text-slate-600'}`}>
                      {item.time}
                    </span>
                  </div>
                  <p className={`text-sm ${item.active ? 'text-slate-400' : 'text-slate-600'} max-w-xl leading-relaxed`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress indicator at bottom */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono text-slate-500">Progress</span>
              <span className="font-mono text-brand-500">4/7 DAYS</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 w-[57%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};