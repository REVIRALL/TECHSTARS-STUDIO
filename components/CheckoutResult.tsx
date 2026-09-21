import React, { useEffect, useState } from 'react';
import { ArrowUpRight, CheckCircle2, RotateCcw, Mail, CalendarClock, Laptop, ShieldCheck } from 'lucide-react';
import { PageType } from '../types';
import { findPlan, isTestMode } from '../services/stripeConfig';

export type CheckoutOutcome = 'thanks' | 'cancel';

interface CheckoutResultProps {
  outcome: CheckoutOutcome;
  onOpenPage: (page: PageType) => void;
}

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden">
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-500/60 via-brand-500/20 to-transparent"></div>
    <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>

    {/* ヘッダー */}
    <header className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
      <a href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
        <img
          src="/logo.png"
          alt="TechStars"
          className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform duration-300"
        />
        <div className="flex items-baseline gap-1 whitespace-nowrap">
          <span className="font-black text-white text-xs md:text-base tracking-tight">TECHSTARS</span>
          <span className="font-mono text-brand-500 text-[8px] md:text-xs tracking-widest">AI</span>
        </div>
      </a>
      <a
        href="/"
        className="font-mono text-xs font-bold text-slate-400 hover:text-brand-500 transition-colors"
      >
        トップへ戻る
      </a>
    </header>

    <main className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-12 pt-12 pb-32">{children}</main>
  </div>
);

/**
 * ★この画面は決済を検証していない。検証できない。
 *   セッションの照会には Stripe の秘密鍵が要り、それをブラウザに置くことはできないため、
 *   サーバが無い構成では原理的に不可能。したがってこの画面は
 *   「決済が成立した証明」ではなく「Stripe から戻ってきた案内」として書く。
 *   URL は誰でも直接開けるので、金額を断定表示しない（偽の支払証明に使われる）。
 *   決済の証明は Stripe が送る領収書メール1本に寄せる。
 */
export const CheckoutResult: React.FC<CheckoutResultProps> = ({ outcome, onOpenPage }) => {
  const [planCode, setPlanCode] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPlanCode(params.get('plan'));
    const sid = params.get('session_id');
    // 照合の手がかりとしてのみ表示する。存在確認はしていない（できない）。
    setReference(sid && /^cs_[A-Za-z0-9_]{10,80}$/.test(sid) ? sid : null);
    setTestMode(isTestMode());
    document.title =
      outcome === 'thanks'
        ? 'お手続きありがとうございます | TECHSTARS'
        : 'お申し込みを中断しました | TECHSTARS';
    // SPA なのでパスごとの meta を静的に置けない。ここで noindex を差し込む。
    // （配信側でも netlify.toml の X-Robots-Tag で二重に止めている）
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, [outcome]);

  const plan = findPlan(planCode);

  if (outcome === 'cancel') {
    return (
      <Shell>
        <div className="animate-slide-up">
          <span className="font-mono text-xs text-slate-500 tracking-widest block mb-6">
            // CHECKOUT CANCELLED
          </span>
          <div className="flex items-start gap-5 mb-10">
            <RotateCcw className="w-10 h-10 md:w-14 md:h-14 text-slate-500 shrink-0 mt-1" aria-hidden="true" />
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-[0.9]">
              お申し込みを
              <br />
              中断しました
            </h1>
          </div>

          <p className="text-slate-400 leading-relaxed max-w-xl mb-12">
            決済は完了していません。料金は発生していませんのでご安心ください。
            {plan && (
              <>
                <br />
                選択されていたプラン: <span className="text-white font-bold">{plan.name}</span>
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/#pricing"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-sans font-black italic tracking-tighter hover:bg-brand-500 transition-colors"
            >
              料金プランへ戻る
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-brand-500 text-brand-500 font-mono text-sm font-bold hover:bg-brand-500 hover:text-black transition-colors"
            >
              相談してから決めたい
            </a>
          </div>

          <p className="font-mono text-xs text-slate-600 mt-12 leading-relaxed">
            うまく決済できなかった場合は support@techstars.studio までご連絡ください。
          </p>
        </div>
      </Shell>
    );
  }

  const steps = [
    {
      icon: Mail,
      title: '決済完了メールが届きます',
      body: 'Stripe から領収書メールが自動送信されます。迷惑メールフォルダもご確認ください。',
    },
    {
      icon: CalendarClock,
      title: '当社からご連絡します',
      body: '2営業日以内に support@techstars.studio または公式LINEより、契約書面のお渡しとDAY1の日程調整のご連絡をいたします。',
    },
    {
      icon: Laptop,
      title: '受講前にご準備いただくもの',
      body: 'PC（Windows / Mac）とインターネット環境、Claude の有料プラン（月額 約3,000円〜）。受講料には含まれません。',
    },
  ];

  return (
    <Shell>
      <div className="animate-slide-up">
        <span className="font-mono text-xs text-brand-500 tracking-widest block mb-6">
          // CHECKOUT COMPLETE
        </span>
        <div className="flex items-start gap-5 mb-10">
          <CheckCircle2
            className="w-10 h-10 md:w-14 md:h-14 text-brand-500 shrink-0 mt-1 drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]"
            aria-hidden="true"
          />
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-[0.9]">
            お手続き
            <br />
            ありがとうございます
          </h1>
        </div>

        {testMode && (
          <p className="font-mono text-xs text-yellow-300 border border-yellow-500/40 bg-yellow-500/5 p-4 mb-10">
            これはテスト環境です。実際の請求は発生していません。
          </p>
        )}

        {/* ★決済の成否をこの画面で断定しない。証明は領収書メールに一本化する。 */}
        <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 mb-12">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-brand-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm text-slate-300 leading-relaxed">
              <p className="font-bold text-white mb-2">決済の証明は、Stripe から届く領収書メールです。</p>
              <p className="text-slate-400">
                この画面は決済後にご案内を表示しているもので、決済が成立したことを証明するものではありません。
                領収書メールが届かない場合、決済は完了していない可能性があります。お手数ですが
                support@techstars.studio までご連絡ください。
              </p>
              {plan && (
                <p className="font-mono text-xs text-slate-500 mt-4">
                  お手続きいただいたプラン（お客様が選択された表示）: {plan.name}
                </p>
              )}
              {reference && (
                <p className="font-mono text-xs text-slate-500 mt-1 break-all">
                  お問い合わせ番号: {reference}
                </p>
              )}
            </div>
          </div>
        </div>

        <span className="font-mono text-xs text-brand-500 tracking-widest block mb-6">// このあとの流れ</span>
        <div className="space-y-4 mb-12">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="flex items-start gap-5 border border-white/10 bg-white/[0.02] p-6 hover:border-brand-500/50 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 border border-brand-500/40 bg-brand-500/10 shrink-0">
                  <Icon className="w-5 h-5 text-brand-400" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[10px] text-brand-500">STEP {String(i + 1).padStart(2, '0')}</span>
                    <h2 className="font-black italic tracking-tight text-lg">{s.title}</h2>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-800 pt-8">
          <p className="font-mono text-xs text-slate-500 leading-relaxed mb-6">
            お申し込み内容やお支払いに関するご確認は support@techstars.studio まで。
            <br />
            クーリングオフを含む契約条件は
            <button
              type="button"
              onClick={() => onOpenPage(PageType.Tokushoho)}
              className="text-brand-500 underline underline-offset-4 hover:text-brand-400 mx-1"
            >
              特定商取引法に基づく表記
            </button>
            をご確認ください。
          </p>
          <a
            href="/"
            className="group inline-flex items-center gap-2 px-8 py-4 border border-brand-500 text-brand-500 font-mono text-sm font-bold hover:bg-brand-500 hover:text-black transition-colors"
          >
            トップへ戻る
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </Shell>
  );
};
