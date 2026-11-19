import React, { useEffect, useState } from 'react';
import { SectionId, PageType } from '../types';
import { PLANS, isCheckoutEnabled, isTestMode, formatYen } from '../services/stripeConfig';
import { ImageFrame } from './ImageFrame';
import { GenIcon } from './GenIcon';
import { REQUEST_URL, REQUEST_BY_MAIL, SUPPORT_EMAIL } from '../content/links';

interface PricingProps {
  onOpenPage: (page: PageType) => void;
  /** ★2026-11-19 料金プランはページに置かず、ポップアップ（FixedPageOverlay の Pricing）の中だけで出す。
   *  ポップアップでは見出しの右上の写真を外す（上に帯があり、写真が帯の下に潜る）。id も付けない */
  inOverlay?: boolean;
}

/**
 * 料金プラン。
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/05-pricing.png。
 *  変えたのは見た目（色・角丸・影・見出しの右上の写真）だけ。決済の出し分け（checkoutEnabled・testMode・同意・
 *  Payment Link の href・押せない時の title）・料金と文言は前のまま（セキュリティの監査済みの部分）。
 *  - 注記の左に引いていた縦の線（border-l）は外した（注記の横に飾りの線を引かない）。
 *  - 見出し・料金の斜体は、和文が合成の斜体で崩れるので外した（絵も料金の数字だけ斜め）。
 *
 * ★2026-11-17 依頼主「// WHY NOW?　こういうのが全部AIっぽい」→ 見た目だけ直した。決済の出し分け・リンク・同意・料金は触っていない。
 *  - 「// 3つのプラン・オンライン完結」は「3つのプラン（すべてオンライン）」の普通の字に。「01 / PLAN」の札を外した。
 *  - 金額の下の区切り線を外し、余白で区切る。水色のグラデーションのボタンと札は一色の塗り・薄い灰の影に。
 *  - 補足の「// 決済」「// 別途必要なもの」「// 分割払い」は「//」を取り、太字の「お支払い」「別に必要な物」「分割払い」に。
 *  - 見出しの字の光とカードに指を乗せた時の影の変化を外した。料金の斜体は正本の絵どおり残す。
 */
export const Pricing: React.FC<PricingProps> = ({ onOpenPage, inOverlay = false }) => {
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
    <section id={inOverlay ? undefined : SectionId.Pricing} className="lp-sec relative bg-white text-ink overflow-x-clip !pb-0">
      {/* ★2026-11-17 円と曲線の版。正本は designs/lp-creative/sections/pricing-pc.png・pricing-sp.png。見た目だけ替えた
          （決済の出し分け・リンク・同意・押せない時の title・料金と文は触っていない）。
          見出しの右上の写真は左下が大きな弧の形（.price-photo）。3つの値段は大きな円の札に置き、真ん中の7日間コースの円を
          ひと回り大きく青い縁に。円の下に項目と「準備中」。下の補足は淡い水色の波の上に。 */}
      {/* 見出しの右上の写真 */}
      {!inOverlay && (
        <div
          className="absolute top-0 right-0 w-[78%] sm:w-[62%] lg:w-[51%] h-[150px] sm:h-[230px] lg:h-[335px] overflow-hidden price-photo pointer-events-none"
          aria-hidden="true"
        >
          <ImageFrame slot="pricing.header" fill density="compact" hideChip imgClassName="object-[72%_30%] lg:object-[64%_30%]" />
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-[54px] relative z-10">
        <div className={`anim-hidden anim-up flex flex-col items-start mb-7 lg:mb-10 gap-1.5 lg:gap-2 ${inOverlay ? 'pt-8 lg:pt-12' : 'pt-[96px] sm:pt-[150px] lg:pt-[110px]'}`}>
          <h2 className="text-[40px] md:text-6xl lg:text-[72px] leading-[1.15] font-black jp-display text-ink">
            料金プラン
          </h2>
          <p className="text-base sm:text-lg lg:text-[22px] font-medium text-ink-soft">3つのプラン（すべてオンライン）</p>
        </div>

        {/* ★テストモードのまま本番に出ている場合の警告。塞いでいることを黙らない。 */}
        {!checkoutEnabled && (
          <div className="mb-10 lg:mb-14 flex items-start gap-4 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-5 sm:px-8 sm:py-6">
            <GenIcon name="alert" className="w-8 h-8" />
            <div>
              <p className="jp-phrase font-black text-ink text-base sm:text-lg mb-1">
                オンライン決済は現在準備中です
              </p>
              <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                決済システムの審査手続き中のため、カードでのお申し込みを一時的に停止しています。
                {/* ★2026-11-17 fix-copy #15：前は「下部のお問い合わせから」だったが、LP に問い合わせ欄は無い。行き先は LMS の資料請求 */}
                {/* ★2026-11-17 LMS の資料請求が本番に出るまで行き先はメール（content/links.ts）。メールの間はメールだと分かる文にする。
                    REQUEST_URL を LMS に戻すと、下の「資料請求のページからどうぞ」の文に自動で戻る */}
                {REQUEST_BY_MAIL ? (
                  <>
                    お問い合わせは、
                    <a href={REQUEST_URL} className="text-brand-700 font-bold underline underline-offset-4 hover:text-brand-800 [overflow-wrap:anywhere]">
                      {SUPPORT_EMAIL}
                    </a>
                    までメールでどうぞ。
                  </>
                ) : (
                  <>
                    お問い合わせは、
                    <a href={REQUEST_URL} className="text-brand-700 font-bold underline underline-offset-4 hover:text-brand-800">
                      資料請求のページ
                    </a>
                    からどうぞ。
                  </>
                )}
              </p>
            </div>
          </div>
        )}
        {checkoutEnabled && testMode && (
          <div className="mb-10 lg:mb-14 flex items-start gap-4 rounded-2xl border border-brand-300 bg-brand-50 px-5 py-5 sm:px-8 sm:py-6">
            <GenIcon name="alert" className="w-8 h-8" />
            <div>
              <p className="font-black text-ink text-base sm:text-lg mb-1">テストモードで動作しています</p>
              <p className="text-sm text-ink-soft leading-relaxed">
                この画面の決済はStripeのテスト環境に接続されています。実際の請求は発生しません。
              </p>
            </div>
          </div>
        )}

        {/* プラン：値段は大きな円の札。円の下に項目とボタン */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 lg:gap-6 xl:gap-10 items-stretch">
          {PLANS.map((plan) => (
            <div key={plan.code} className="anim-hidden anim-up relative flex flex-col">
              <div
                className={`relative mx-auto flex flex-col items-center justify-center text-center rounded-full bg-white px-6 aspect-square ${
                  plan.highlight
                    ? 'w-[min(100%,330px)] lg:w-[min(100%,444px)] ring-[3px] ring-brand-500 shadow-lift'
                    : 'w-[min(100%,300px)] lg:w-[min(100%,410px)] shadow-[0_18px_44px_-18px_rgba(11,27,46,0.22),0_0_0_10px_rgba(220,242,253,0.55)]'
                }`}
              >
                {plan.highlight && (
                  <span className="mb-2 xl:mb-3 rounded-full bg-brand-500 text-ink text-sm xl:text-base font-black px-5 xl:px-7 py-1.5 xl:py-2">
                    おすすめ
                  </span>
                )}
                {/* ★名前に「（7日間コース）」のような括弧が付くと「…プラ／ン」と語の途中で折れた。括弧の前で2行に分ける */}
                <h3 className="text-[26px] lg:text-[24px] xl:text-[34px] font-black jp-display text-ink leading-tight">
                  {plan.name.includes('（') ? (
                    <>
                      <span className="block whitespace-nowrap">{plan.name.slice(0, plan.name.indexOf('（'))}</span>
                      <span className="block whitespace-nowrap text-[0.72em]">{plan.name.slice(plan.name.indexOf('（'))}</span>
                    </>
                  ) : (
                    plan.name
                  )}
                </h3>
                <p className="mt-1.5 lg:mt-2.5 max-w-[21em] text-sm lg:text-[13px] xl:text-[17px] text-ink-soft leading-snug [word-break:keep-all] [overflow-wrap:anywhere]">{plan.tagline}</p>
                {/* ★2026-11-17 REVIRALL の main（2609ff2）の直しを取り込む：面談を受けた方に適用される「面談特典価格」の札と注記。
                    円の中の大きな値段は前のまま面談特典価格。2026-11-19 から通常価格を円の下に足した（下の「通常価格」） */}
                {plan.offer && (
                  <span className="mt-2.5 xl:mt-3 rounded-full bg-brand-50 px-3 py-0.5 text-[12px] xl:text-[14px] font-bold text-brand-700">{plan.offer.label}</span>
                )}
                <span className="mt-3 lg:mt-3 xl:mt-5 text-[40px] lg:text-[38px] xl:text-[60px] leading-none font-black italic tracking-tight text-brand-700">
                  {formatYen(plan.offer ? plan.offer.amount : plan.amount)}
                </span>
                <p className="mt-2.5 lg:mt-2.5 xl:mt-4 text-[13px] xl:text-[16px] text-ink-mute">{plan.offer ? plan.offer.taxNote : plan.taxNote}</p>
                {plan.offer && (
                  <p className="mt-1.5 whitespace-nowrap text-[12px] xl:text-[13px] text-ink-mute leading-snug">面談を受けた方に適用される価格です。</p>
                )}
              </div>

              {/* ★2026-11-19 ユーザー「通常額もだして」：通常価格（LP から申し込む値段）。円の中は込み合うので円の下に置く */}
              {plan.offer && (
                <div className="mt-6 lg:mt-7 mx-auto flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 rounded-2xl bg-slate-50 px-5 py-3 text-center">
                  <span className="text-[13px] xl:text-[14px] font-bold text-ink-soft">通常価格</span>
                  <span className="text-[22px] xl:text-[26px] font-black text-ink tracking-tight">{formatYen(plan.amount)}</span>
                  <span className="text-[12px] xl:text-[13px] text-ink-mute">{plan.taxNote}</span>
                </div>
              )}

              <ul className={`${plan.offer ? 'mt-6 lg:mt-7' : 'mt-7 lg:mt-9'} space-y-3 mb-7 flex-1`}>
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] lg:text-[14px] xl:text-[15px] text-ink-soft leading-relaxed">
                    <GenIcon name="check" className="w-6 h-6 mt-0.5" />
                    <span className="text-pretty">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.note && (
                <p className="text-[13px] lg:text-[15px] text-ink-mute leading-relaxed mb-5 lg:px-2">
                  {plan.note}
                </p>
              )}

              {/* ★面談特典価格のあるプラン：先に面談の相談（特典価格のリンクは面談を受けた方にだけ送る。URL は配信物に入れない）、
                  その下に通常価格で申し込むボタン。特典価格の無いプランは「このプランを申し込む」だけ */}
              <div className="flex flex-col gap-3">
                {plan.offer && (
                  <>
                    <p className="text-[13px] lg:text-[14px] text-ink-mute leading-relaxed lg:px-2">
                      面談を受けた方に、{plan.offer.label}でのお申し込みのご案内（お支払いのリンク）をお送りします。
                    </p>
                    <a
                      href={REQUEST_URL}
                      className={`group flex items-center justify-center gap-2 w-full min-h-[60px] lg:min-h-[66px] px-6 rounded-2xl font-sans font-black text-base lg:text-lg transition-colors duration-300 ${
                        plan.highlight
                          ? 'bg-brand-500 text-ink shadow-cta hover:bg-brand-400'
                          : 'bg-white text-ink shadow-card ring-1 ring-slate-200 hover:text-brand-700 hover:ring-brand-400'
                      }`}
                    >
                      資料請求・面談のご相談
                      <GenIcon name="arrow-up-right" className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </>
                )}
                {canBuy ? (
                  <a
                    href={plan.paymentLink}
                    className={`group flex items-center justify-center gap-2 w-full min-h-[60px] lg:min-h-[66px] px-6 rounded-2xl font-sans font-black text-base lg:text-lg transition-colors duration-300 ${
                      plan.highlight && !plan.offer
                        ? 'bg-brand-500 text-ink shadow-cta hover:bg-brand-400'
                        : 'bg-white text-ink shadow-card ring-1 ring-slate-200 hover:text-brand-700 hover:ring-brand-400'
                    }`}
                  >
                    {plan.offer ? '通常価格で申し込む' : 'このプランを申し込む'}
                    <GenIcon name="arrow-up-right" className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
                    className="flex items-center justify-center gap-2.5 w-full min-h-[60px] lg:min-h-[66px] px-6 rounded-2xl bg-slate-200 text-ink-mute font-sans font-black text-base lg:text-lg cursor-not-allowed"
                  >
                    <GenIcon name="lock" className="w-6 h-6" />
                    {checkoutEnabled ? '同意が必要です' : '準備中'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 同意 */}
        <div className="anim-hidden anim-up mt-10 lg:mt-11 rounded-2xl border border-slate-200 bg-white px-5 py-5 sm:px-8 sm:py-6">
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
                className="inline-flex items-center min-h-[44px] align-middle text-brand-700 font-bold underline underline-offset-4 hover:text-brand-800"
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
                className="inline-flex items-center min-h-[44px] align-middle text-brand-700 font-bold underline underline-offset-4 hover:text-brand-800"
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
                className="inline-flex items-center min-h-[44px] align-middle text-brand-700 font-bold underline underline-offset-4 hover:text-brand-800"
              >
                プライバシーポリシー
              </button>
              <span>に同意します。</span>
            </span>
          </label>
        </div>

        {/* 補足：淡い水色の波の上に3つ */}
      </div>
      <div className="relative mt-8 lg:mt-6 bg-mist pt-[72px] sm:pt-[88px] lg:pt-[112px] pb-14 lg:pb-[64px]">
        <div aria-hidden="true" className="wave wave-top [--from:#ffffff]" />
        <span aria-hidden="true" className="dot hidden lg:block w-[260px] h-[260px] -left-[90px] top-[20px] opacity-60" />
        <span aria-hidden="true" className="dot hidden lg:block w-[300px] h-[300px] right-[-120px] top-[10px] opacity-60" />
        <div className="anim-hidden anim-up relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-[54px] grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-10 text-sm sm:text-[15px] lg:text-base text-ink-soft">
          <p className="jp-text leading-relaxed">
            <span className="font-black text-ink text-base lg:text-[20px] block mb-2">お支払い</span>
            クレジットカード決済（Stripe）。カード情報は当社を経由せず、Stripeへ直接送信されます。
          </p>
          <p className="jp-text leading-relaxed">
            <span className="font-black text-ink text-base lg:text-[20px] block mb-2">別に必要な物</span>
            ChatGPT「Plus」か Claude「Pro」のどちらか1つ（月額20米ドル）をご自身でご契約いただきます。受講料には含まれません。
          </p>
          <p className="jp-text leading-relaxed">
            <span className="font-black text-ink text-base lg:text-[20px] block mb-2">分割払い</span>
            分割をご希望の場合はお問い合わせください。提携ローンでのお支払いをご案内します。
          </p>
        </div>
      </div>
    </section>
  );
};
