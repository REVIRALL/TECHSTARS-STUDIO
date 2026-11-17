import React, { useEffect, useState } from 'react';
import { PageType } from '../types';
import { findPlan, isTestMode } from '../services/stripeConfig';
import { GenIcon } from './GenIcon';
import { REQUEST_URL } from '../content/links';

export type CheckoutOutcome = 'thanks' | 'cancel';

interface CheckoutResultProps {
  outcome: CheckoutOutcome;
  onOpenPage: (page: PageType) => void;
}

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-mist text-ink font-sans relative overflow-x-hidden">
    {/* ★2026-11-16 明るい版（LP の明るい版にそろえる。見た目だけ・文言と動きは前のまま）。上の端の線と方眼の地は外した。
        ★2026-11-17 依頼主「こういうのが全部AIっぽい」→ 地のぼかした写真の光、「// CHECKOUT …」「STEP 01」の札、
        等幅の書体（お問い合わせ番号の値だけ残す）、水色のグラデーションのボタン、カードに指を乗せた時の影の変化を外した */}

    {/* ヘッダー */}
    <header className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
      <a href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
        <img
          src="/logo.png"
          alt="TechStars"
          className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform duration-300"
        />
        <div className="flex items-baseline gap-1 whitespace-nowrap">
          <span className="font-black text-ink text-sm md:text-lg tracking-tight">TECHSTARS</span>
          <span className="font-black text-brand-700 text-sm md:text-lg tracking-tight">AI</span>
        </div>
      </a>
      <a
        href="/"
        className="inline-flex items-center min-h-[44px] text-sm font-bold text-ink-mute hover:text-brand-700 transition-colors"
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
          <div className="flex items-start gap-5 mb-10">
            <GenIcon name="rotate" className="w-12 h-12 md:w-16 md:h-16 mt-1" />
            <h1 className="text-4xl md:text-6xl font-black jp-display tracking-tight leading-[1.05]">
              お申し込みを
              <br />
              中断しました
            </h1>
          </div>

          <p className="text-ink-soft leading-relaxed max-w-xl mb-12">
            決済は完了していません。料金は発生していませんのでご安心ください。
            {plan && (
              <>
                <br />
                選択されていたプラン: <span className="text-ink font-bold">{plan.name}</span>
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/#pricing"
              className="group inline-flex items-center justify-center gap-2 min-h-[56px] px-8 rounded-xl bg-brand-500 text-ink font-sans font-black shadow-cta hover:bg-brand-400 transition-colors"
            >
              料金プランへ戻る
              <GenIcon name="arrow-up-right" className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            {/* ★2026-11-17 fix-copy #15：相談の行き先は LMS の資料請求（前は LP の AI 診断の箱へ戻していた） */}
            <a
              href={REQUEST_URL}
              className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 rounded-xl border-2 border-brand-500 bg-white text-brand-700 text-base font-bold hover:bg-brand-500 hover:text-ink transition-colors"
            >
              相談してから決めたい
            </a>
          </div>

          <p className="text-sm text-ink-mute mt-12 leading-relaxed">
            うまく決済できなかった場合は support@techstars.studio までご連絡ください。
          </p>
        </div>
      </Shell>
    );
  }

  const steps = [
    {
      icon: 'mail' as const,
      title: '決済完了メールが届きます',
      body: 'Stripe から領収書メールが自動送信されます。迷惑メールフォルダもご確認ください。',
    },
    {
      icon: 'calendar-clock' as const,
      title: '当社からご連絡します',
      body: '2営業日以内に support@techstars.studio または公式LINEよりご連絡します。契約書面は簡易書留で郵送し、お支払いの確認から7日以内にLMSのアカウントをお知らせします（7日間コースは講義の日程調整もあわせて行います）。',
    },
    {
      icon: 'laptop' as const,
      title: '受講前にご準備いただくもの',
      body: 'PC（Windows / Mac）とインターネット環境、ChatGPT「Plus」か Claude「Pro」のどちらか1つ（月額20米ドル）。受講料には含まれません。',
    },
  ];

  return (
    <Shell>
      <div className="animate-slide-up">
        <div className="flex items-start gap-5 mb-10">
          <GenIcon name="check-circle" className="w-12 h-12 md:w-16 md:h-16 mt-1" eager />
          <h1 className="text-4xl md:text-6xl font-black jp-display tracking-tight leading-[1.05]">
            お手続き
            <br />
            ありがとうございます
          </h1>
        </div>

        {testMode && (
          <p className="text-sm text-amber-900 rounded-xl border border-amber-300 bg-amber-50 p-4 mb-10">
            これはテスト環境です。実際の請求は発生していません。
          </p>
        )}

        {/* ★決済の成否をこの画面で断定しない。証明は領収書メールに一本化する。 */}
        <div className="rounded-2xl bg-white shadow-card p-6 md:p-8 mb-12">
          <div className="flex items-start gap-4">
            <GenIcon name="shield-check" className="w-7 h-7 mt-0.5" />
            <div className="text-sm text-ink-soft leading-relaxed">
              <p className="font-bold text-ink mb-2">決済の証明は、Stripe から届く領収書メールです。</p>
              <p className="text-ink-soft">
                この画面は決済後にご案内を表示しているもので、決済が成立したことを証明するものではありません。
                領収書メールが届かない場合、決済は完了していない可能性があります。お手数ですが
                support@techstars.studio までご連絡ください。
              </p>
              {plan && (
                <p className="text-[13px] text-ink-mute mt-4">
                  お手続きいただいたプラン（お客様が選択された表示）: {plan.name}
                </p>
              )}
              {reference && (
                <p className="text-[13px] text-ink-mute mt-1 break-all">
                  お問い合わせ番号: <span className="font-mono">{reference}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-lg md:text-xl font-black text-ink mb-5">このあとの流れ</h2>
        <div className="space-y-4 mb-12">
          {steps.map((s) => {
            return (
              <div
                key={s.title}
                className="flex items-start gap-5 rounded-2xl bg-white shadow-card p-6"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 shrink-0">
                  <GenIcon name={s.icon} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black tracking-tight text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{s.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4">
          <p className="text-sm text-ink-mute leading-relaxed mb-6">
            お申し込み内容やお支払いに関するご確認は support@techstars.studio まで。
            <br />
            クーリングオフを含む契約条件は
            <button
              type="button"
              onClick={() => onOpenPage(PageType.Tokushoho)}
              className="text-brand-700 underline underline-offset-4 hover:text-brand-800 mx-1"
            >
              特定商取引法に基づく表記
            </button>
            をご確認ください。
          </p>
          <a
            href="/"
            className="group inline-flex items-center gap-2 min-h-[56px] px-8 rounded-xl border-2 border-brand-500 bg-white text-brand-700 text-base font-bold hover:bg-brand-500 hover:text-ink transition-colors"
          >
            トップへ戻る
            <GenIcon name="arrow-up-right" className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </Shell>
  );
};
