import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PageType } from '../types';
import { PageLink } from './PageLink';
import { FAQS } from '../content/site';

/**
 * トップページのFAQ。
 *
 * これまでFAQはモーダルの中だけにあり、JSを実行しないクローラー
 * （GPTBot / ClaudeBot / PerplexityBot 等）からは存在しないのと同じだった。
 * 「未経験でもできるか」「いくらか」は検索でも生成AIでも最も多い問いなので、
 * トップの静的HTMLに平文で置く。全文は /faq/ にある。
 *
 * <details> を使うので、JSが無くても開閉できる。
 * 初期状態で閉じていてもDOMには全文があり、クローラーは読める。
 */

const HOME_FAQ_COUNT = 6;

export const Faq: React.FC<{ onOpenPage?: (page: PageType) => void }> = ({ onOpenPage }) => {
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
    <section ref={sectionRef} id="faq" className="relative bg-black pt-28 lg:pt-44 pb-24 lg:pb-36 overflow-hidden">
      <div className="absolute top-0 left-0 w-full section-rule" />
      <div className="absolute inset-0 cyber-grid opacity-[0.18] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className={`flex flex-wrap items-end justify-between gap-4 mb-10 lg:mb-14 anim-hidden anim-up ${isVisible ? 'anim-visible' : ''}`}>
          <div>
            <p className="font-mono text-xs text-brand-500 mb-4 tracking-widest">// FAQ</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black jp-display text-white">よくある質問</h2>
          </div>
          <PageLink
            route="faq"
            onOpenPage={onOpenPage}
            className="inline-flex items-center gap-2 font-mono text-xs text-brand-500 border border-brand-500/40 px-4 py-2.5 hover:bg-brand-500 hover:text-black transition-colors"
          >
            すべての質問を見る
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </PageLink>
        </div>

        <div className="max-w-4xl border-t border-slate-800">
          {FAQS.slice(0, HOME_FAQ_COUNT).map((item, i) => (
            <details
              key={item.q}
              className={`group border-b border-slate-800 anim-hidden anim-up ${
                isVisible ? `anim-visible delay-${Math.min(i + 1, 6)}` : ''
              }`}
            >
              <summary className="flex items-start gap-4 cursor-pointer list-none py-5 sm:py-6 text-white hover:text-brand-400 transition-colors">
                <span className="font-mono text-xs text-brand-500 shrink-0 pt-1.5" aria-hidden="true">
                  Q{String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="flex-1 text-base sm:text-lg font-bold leading-relaxed">{item.q}</h3>
                <span
                  className="shrink-0 mt-1.5 w-4 h-4 relative before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-current after:transition-transform group-open:after:scale-y-0"
                  aria-hidden="true"
                />
              </summary>
              <p className="jp-body pb-6 pl-0 sm:pl-10 text-sm text-slate-400 leading-relaxed max-w-3xl">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
