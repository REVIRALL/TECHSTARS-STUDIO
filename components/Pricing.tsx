import React, { useEffect, useState } from 'react';
import { SectionId, PageType } from '../types';
import { Check, ArrowUpRight, AlertTriangle, Lock } from 'lucide-react';
import { PLANS, isCheckoutEnabled, isTestMode, formatYen } from '../services/stripeConfig';
import { ImageFrame } from './ImageFrame';

interface PricingProps {
  onOpenPage: (page: PageType) => void;
}

/**
 * 料金プラン。
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/05-pricing.png。
 *  変えたのは見た目（色・角丸・影・見出しの右上の写真）だけ。決済の出し分け（checkoutEnabled・testMode・同意・
 *  Payment Link の href・押せない時の title）・料金と文言は前のまま（セキュリティの監査済みの部分）。
 *  - 注記の左に引いていた縦の線（border-l）は外した（注記の横に飾りの線を引かない）。
 *  - 見出し・料金の斜体は、和文が合成の斜体で崩れるので外した（絵も料金の数字だけ斜め）。
 */
export const Pricing: React.FC<PricingProps> = ({ onOpenPage }) => {
  const [agreed, setAgreed] = useState(false);
  // ★既定は「塞いだ状態」。判定の既定を「通す」側に置くと、評価が走る前の一瞬や
  //   評価が失敗したときにボタンが出てしまう。安全側に倒す。
  const [checkoutEnabled, setCheckoutEnabled] = useState(false);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    setCheckoutEnabled(isCheckoutEnabled());
    setTestMode(isTestMode());
  }, []);

  const canBuy = agreed && checkoutEnabled;

  return (
    <section id={SectionId.Pricing} className="lp-sec relative bg-white text-ink overflow-x-clip">
      {/* 見出しの右上の写真。左と下は白に溶かす */}
      <div
        className="absolute top-0 right-0 w-full md:w-[72%] h-[260px] sm:h-[300px] lg:h-[340px] pointer-events-none [mask-image:linear-gradient(90deg,transparent_0%,#000_35%),linear-gradient(180deg,#000_55%,transparent_100%)] [mask-composite:intersect] [-webkit-mask-composite:source-in] opacity-90 md:opacity-100"
        aria-hidden="true"
      >
        <ImageFrame slot="pricing.header" fill density="compact" hideChip imgClassName="object-[60%_25%]" />
        <div className="absolute inset-0 bg-white/40 md:bg-transparent" />
      </div>

      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <div className="anim-hidden anim-up flex flex-col md:flex-row justify-between items-start md:items-end mb-8 lg:mb-10 gap-3 pt-6 lg:pt-14">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black jp-display text-ink [text-shadow:0_0_24px_rgba(255,255,255,0.9)]">
            料金プラン
          </h2>
          <span className="font-mono font-bold text-xs sm:text-sm text-brand-700 md:mb-2 px-2 py-1 rounded bg-white/80">// 3つのプラン・オンライン完結</span>
        </div>

        {/* ★テストモードのまま本番に出ている場合の警告。塞いでいることを黙らない。 */}
        {!checkoutEnabled && (
          <div className="mb-8 lg:mb-10 flex items-start gap-4 rounded-xl border border-amber-300 bg-amber-50 p-5 sm:p-6">
            <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-black text-ink text-base sm:text-lg mb-1">
                オンライン決済は現在準備中です
              </p>
              <p className="text-sm text-ink-soft leading-relaxed">
                決済システムの審査手続き中のため、カードでのお申し込みを一時的に停止しています。
                お申し込みご希望の方は下部のお問い合わせからご連絡ください。
              </p>
            </div>
          </div>
        )}
        {checkoutEnabled && testMode && (
          <div className="mb-8 lg:mb-10 flex items-start gap-4 rounded-xl border border-brand-300 bg-brand-50 p-5 sm:p-6">
            <AlertTriangle className="w-7 h-7 text-brand-700 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-black text-ink text-base sm:text-lg mb-1">テストモードで動作しています</p>
              <p className="text-sm text-ink-soft leading-relaxed">
                この画面の決済はStripeのテスト環境に接続されています。実際の請求は発生しません。
              </p>
            </div>
          </div>
        )}

        {/* プランカード */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-6 xl:gap-8 items-stretch">
          {PLANS.map((plan, idx) => (
            <div
              key={plan.code}
              className={`anim-hidden anim-up relative flex flex-col p-7 sm:p-8 lg:p-7 xl:p-8 rounded-2xl bg-white transition-shadow ${
                plan.highlight
                  ? 'ring-2 ring-brand-400 shadow-lift mt-4 lg:mt-0'
                  : 'shadow-card hover:shadow-lift'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-4 left-7 sm:left-8 rounded-lg bg-gradient-to-b from-brand-400 to-brand-500 text-ink text-sm font-black px-4 py-1.5">
                  おすすめ
                </span>
              )}

              <span className="font-mono font-bold text-[13px] text-brand-700 tracking-[0.18em] mb-3">
                {String(idx + 1).padStart(2, '0')} / PLAN
              </span>
              <h3 className="text-2xl md:text-3xl font-black jp-display text-ink mb-2">{plan.name}</h3>
              <p className="text-sm sm:text-[15px] text-ink-soft mb-6 leading-relaxed">{plan.tagline}</p>

              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl xl:text-[56px] font-black italic tracking-tight text-brand-700">
                    {formatYen(plan.amount)}
                  </span>
                </div>
                <p className="text-[13px] text-ink-mute mt-2">{plan.taxNote}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm sm:text-[15px] lg:text-sm 2xl:text-[15px] text-ink-soft leading-relaxed">
                    <Check className="w-4 h-4 shrink-0 mt-1 text-brand-600" strokeWidth={3} aria-hidden="true" />
                    <span className="text-pretty">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.note && (
                <p className="text-[12px] text-ink-mute leading-relaxed mb-5">
                  {plan.note}
                </p>
              )}

              {canBuy ? (
                <a
                  href={plan.paymentLink}
                  className={`group flex items-center justify-center gap-2 w-full min-h-[56px] px-6 rounded-xl font-sans font-black text-base transition-colors duration-300 ${
                    plan.highlight
                      ? 'bg-gradient-to-b from-brand-400 to-brand-500 text-ink shadow-cta hover:to-brand-600'
                      : 'bg-white text-ink shadow-card ring-1 ring-slate-200 hover:text-brand-700 hover:ring-brand-400'
                  }`}
                >
                  このプランを申し込む
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
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
                  className="flex items-center justify-center gap-2 w-full min-h-[56px] px-6 rounded-xl bg-slate-200 text-ink-mute font-sans font-black text-base cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  {checkoutEnabled ? '同意が必要です' : '準備中'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 同意 */}
        <div className="anim-hidden anim-up mt-8 lg:mt-10 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={!checkoutEnabled}
              className="mt-0.5 w-6 h-6 shrink-0 accent-[#0675AD] cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-sm sm:text-[15px] text-ink leading-relaxed">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenPage(PageType.Terms);
                }}
                className="text-brand-700 font-bold underline underline-offset-4 hover:text-brand-800"
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
                className="text-brand-700 font-bold underline underline-offset-4 hover:text-brand-800"
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
                className="text-brand-700 font-bold underline underline-offset-4 hover:text-brand-800"
              >
                プライバシーポリシー
              </button>
              <span>に同意します。</span>
            </span>
          </label>
        </div>

        {/* 補足 */}
        <div className="anim-hidden anim-up mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px] sm:text-sm text-ink-mute">
          <p className="leading-relaxed">
            <span className="font-mono font-bold text-brand-700 block mb-1">// 決済</span>
            クレジットカード決済（Stripe）。カード情報は当社を経由せず、Stripeへ直接送信されます。
          </p>
          <p className="leading-relaxed">
            <span className="font-mono font-bold text-brand-700 block mb-1">// 別途必要なもの</span>
            ChatGPT「Plus」か Claude「Pro」のどちらか1つ（月額20米ドル）をご自身でご契約いただきます。受講料には含まれません。
          </p>
          <p className="leading-relaxed">
            <span className="font-mono font-bold text-brand-700 block mb-1">// 分割払い</span>
            分割をご希望の場合はお問い合わせください。提携ローンでのお支払いをご案内します。
          </p>
        </div>
      </div>
    </section>
  );
};
