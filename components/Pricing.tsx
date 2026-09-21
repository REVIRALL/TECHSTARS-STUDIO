import React, { useEffect, useRef, useState } from 'react';
import { SectionId, PageType } from '../types';
import { Check, ArrowUpRight, AlertTriangle, Lock } from 'lucide-react';
import { PLANS, isCheckoutEnabled, isTestMode, formatYen } from '../services/stripeConfig';

interface PricingProps {
  onOpenPage: (page: PageType) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onOpenPage }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  // ★既定は「塞いだ状態」。判定の既定を「通す」側に置くと、評価が走る前の一瞬や
  //   評価が失敗したときにボタンが出てしまう。安全側に倒す。
  const [checkoutEnabled, setCheckoutEnabled] = useState(false);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    setCheckoutEnabled(isCheckoutEnabled());
    setTestMode(isTestMode());
  }, []);

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

  const canBuy = agreed && checkoutEnabled;

  return (
    <section
      ref={sectionRef}
      id={SectionId.Pricing}
      className="relative bg-black text-white pt-28 lg:pt-44 pb-28 lg:pb-44 overflow-x-hidden"
    >
      {/* 上部の水平ネオンライン（セクション区切り） */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-500/60 via-brand-500/20 to-transparent"></div>
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div
          className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-12 lg:mb-20 border-b border-slate-800 pb-8 gap-4 anim-hidden anim-up ${
            isVisible ? 'anim-visible' : ''
          }`}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
            料金プラン
          </h2>
          <span className="font-mono text-xs text-brand-500 md:mb-2">// 3つのプラン・オンライン完結</span>
        </div>

        {/* ★テストモードのまま本番に出ている場合の警告。塞いでいることを黙らない。 */}
        {!checkoutEnabled && (
          <div className="mb-12 flex items-start gap-4 border border-yellow-500/40 bg-yellow-500/5 p-6">
            <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-black italic tracking-tight text-yellow-300 mb-1">
                オンライン決済は現在準備中です
              </p>
              <p className="font-mono text-xs text-slate-400 leading-relaxed">
                決済システムの審査手続き中のため、カードでのお申し込みを一時的に停止しています。
                お申し込みご希望の方は下部のお問い合わせからご連絡ください。
              </p>
            </div>
          </div>
        )}
        {checkoutEnabled && testMode && (
          <div className="mb-12 flex items-start gap-4 border border-brand-500/40 bg-brand-500/5 p-6">
            <AlertTriangle className="w-6 h-6 text-brand-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-black italic tracking-tight text-brand-300 mb-1">テストモードで動作しています</p>
              <p className="font-mono text-xs text-slate-400 leading-relaxed">
                この画面の決済はStripeのテスト環境に接続されています。実際の請求は発生しません。
              </p>
            </div>
          </div>
        )}

        {/* プランカード */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan, idx) => (
            <div
              key={plan.code}
              className={`relative flex flex-col p-8 border transition-colors anim-hidden anim-up ${
                isVisible ? `anim-visible delay-${idx + 1}` : ''
              } ${
                plan.highlight
                  ? 'bg-gradient-to-b from-brand-500/10 to-transparent border-brand-500 shadow-[0_0_40px_rgba(0,229,255,0.15)]'
                  : 'bg-black border-white/10 hover:border-brand-500/50'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-8 bg-brand-500 text-black font-mono text-[10px] font-bold px-3 py-1 tracking-widest">
                  おすすめ
                </span>
              )}

              <span className="font-mono text-[10px] text-brand-500 tracking-widest mb-3">
                {String(idx + 1).padStart(2, '0')} / PLAN
              </span>
              <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">{plan.tagline}</p>

              <div className="mb-8 pb-8 border-b border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl md:text-5xl font-black italic tracking-tighter ${
                      plan.highlight ? 'text-brand-400' : 'text-white'
                    }`}
                  >
                    {formatYen(plan.amount)}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-slate-500 mt-2">{plan.taxNote}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-1 ${plan.highlight ? 'text-brand-400' : 'text-slate-500'}`}
                      aria-hidden="true"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.note && (
                <p className="font-mono text-[10px] text-slate-500 leading-relaxed mb-6 border-l-2 border-slate-700 pl-3">
                  {plan.note}
                </p>
              )}

              {canBuy ? (
                <a
                  href={plan.paymentLink}
                  className={`group flex items-center justify-center gap-2 w-full px-6 py-4 font-sans font-black italic tracking-tighter text-base transition-colors duration-300 ${
                    plan.highlight
                      ? 'bg-brand-500 text-black hover:bg-white'
                      : 'bg-white text-black hover:bg-brand-500'
                  }`}
                >
                  このプランを申し込む
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title={
                    checkoutEnabled
                      ? '下の同意チェックを入れるとお申し込みに進めます'
                      : 'オンライン決済は現在準備中です'
                  }
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-800 text-slate-500 font-sans font-black italic tracking-tighter text-base cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  {checkoutEnabled ? '同意が必要です' : '準備中'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 同意 */}
        <div
          className={`mt-10 border border-white/10 bg-white/[0.02] p-6 anim-hidden anim-up ${
            isVisible ? 'anim-visible delay-4' : ''
          }`}
        >
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={!checkoutEnabled}
              className="mt-1 w-5 h-5 shrink-0 accent-[#00E5FF] cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-sm text-slate-300 leading-relaxed">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenPage(PageType.Terms);
                }}
                className="text-brand-500 underline underline-offset-4 hover:text-brand-400"
              >
                利用規約
              </button>
              <span className="mx-1">と</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenPage(PageType.Tokushoho);
                }}
                className="text-brand-500 underline underline-offset-4 hover:text-brand-400"
              >
                特定商取引法に基づく表記
              </button>
              <span className="mx-1">、</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenPage(PageType.Privacy);
                }}
                className="text-brand-500 underline underline-offset-4 hover:text-brand-400"
              >
                プライバシーポリシー
              </button>
              <span>に同意します。</span>
            </span>
          </label>
        </div>

        {/* 補足 */}
        <div
          className={`mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-slate-500 anim-hidden anim-up ${
            isVisible ? 'anim-visible delay-5' : ''
          }`}
        >
          <p className="leading-relaxed">
            <span className="text-slate-300 block mb-1">// 決済</span>
            クレジットカード決済（Stripe）。カード情報は当社を経由せず、Stripeへ直接送信されます。
          </p>
          <p className="leading-relaxed">
            <span className="text-slate-300 block mb-1">// 別途必要なもの</span>
            Claude の有料プラン（月額 約3,000円〜）をご自身でご契約いただきます。受講料には含まれません。
          </p>
          <p className="leading-relaxed">
            <span className="text-slate-300 block mb-1">// 分割払い</span>
            分割をご希望の場合はお問い合わせください。提携ローンでのお支払いをご案内します。
          </p>
        </div>
      </div>
    </section>
  );
};
