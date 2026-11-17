import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { SectionId } from '../types';
import { ImageFrame } from './ImageFrame';
import { GenIcon } from './GenIcon';
import { REQUEST_URL } from '../content/links';

/**
 * こういう人向け と 君も、星になれ。（お問い合わせ）
 * ★2026-11-16 明るい版。正本の絵は designs/lp-bright/sections/07-contact.png。
 *  - 上：白いカード6枚（水色のチェック）と、水色の枠の一言の帯。前のカード面の暗い質感の画像は外した。
 *  - 下：暗い星空をやめ、明るい光の写真（contact.cta）を敷き、左に見出しと説明、右に相談の箱（白い窓）。
 *    1回目の絵は上の写真が最初の画面の女性とそっくり、下の写真が「ノートPCに向かう黒髪の男性」になったので描き直させた。
 *  - 引用の上に引いていた区切りの線は外した（注記の上下に飾りの線を引かない）。
 *  - スマホは写真（4:5）の上の明るい所に見出しを載せ、その下に引用と相談の箱を続ける（写真は消さない）。
 *
 * ★2026-11-17 依頼主「// WHY NOW?　こういうのが全部AIっぽい」→ 見た目を直した。
 *  - 「// TARGET_PROFILE.scan()」の札、一言の帯の小さい四角・太い水色の枠・「SIGNAL_DETECTED」を外した。
 *  - 「$ mission …」「$ status …」の作り物の端末の行をやめ、「メール：support@techstars.studio」だけ残した。
 *  - 相談の箱の「ai_consultation.exe」・赤黄緑の丸・「READY」・「>」の題の帯と、すりガラス風のぼかしを外し、白一色に。
 *  - 地のぼかした写真の光、カードに指を乗せた時の影の変化を外した。
 *
 * ★2026-11-17 文の直し（fix-copy.md）：
 *  #12 一言の帯を「当てはまる物があれば、下から無料で相談できます。」に。6枚は意味を変えずに「短文。短文」の2拍をばらした。
 *  #13 「君も、星になれ。」「TECH × 星」「7日後、別人になっている。」をやめ、
 *      見出し「まずは無料で、話を聞いてください。」・説明「7日間で何を作るか…講師が無料でお答えします。」に。
 *  #14 出典の無い引用を外した。
 *  #15 相談の行き先を LMS の資料請求（content/links.ts）にし、見出しの下に大きいボタンで置く。
 *      AI 診断の箱は残すが、相談の受け口ではないと分かるよう「AIにその場で聞く（答えるのはAI）」の名前にした。
 *  #17 AI 診断のボタン「EXECUTE」→「AIに聞いてみる」。
 *  残りの片付け：説明の「講師が無料でお答えします」は言い切りをやめ、資料請求ページの作り（資料をメールで送る・
 *  ご質問の欄がある）に合わせた。AI の箱の「講師への相談は…」も同じ理由で「資料やご質問は…」に。
 */

/**
 * AI診断フォームは react-markdown と @google/genai を引き連れてくる。
 * 初期表示ではまず見えない位置にあるので、別チャンクに切り出して
 * このセクションが画面に入るまで読み込まない。
 * 見た目が変わらないよう、読み込み前は同じ形のスケルトンを出す。
 */
const IdeaValidator = lazy(() =>
  import('./IdeaValidator').then((m) => ({ default: m.IdeaValidator }))
);

const ValidatorSkeleton: React.FC = () => (
  <div className="w-full" aria-hidden="true">
    <p className="mb-2 text-sm font-bold text-ink">知りたいこと・お悩み</p>
    <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
      <div className="w-full px-4 py-4 text-base sm:text-sm text-slate-500 min-h-[100px]">
        あなたの目標やお悩みを入力...
      </div>
      <div className="px-4 py-3 flex justify-end items-center bg-white">
        <div className="min-h-[44px] flex items-center px-6 rounded-lg bg-slate-200 text-ink-mute text-sm font-black">
          AIに聞いてみる
        </div>
      </div>
    </div>
  </div>
);

const TARGETS = [
  'Progate を途中でやめてしまったが、まだ諦めていない',
  '平日は忙しく、週末しか時間が取れない',
  'ChatGPT を使っているが、仕事でもっと役立てたい',
  '副業を始めたいのに、何から手をつければいいか分からない',
  '毎日くり返している作業を、自動にしたい',
  '独学に限界を感じていて、エンジニアへの転職も考えている',
];

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  // 相談の箱（AI診断）の重い部品は、この区画が画面に入ってから読み込む
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
    <section ref={sectionRef} id={SectionId.Contact} className="relative overflow-x-clip">
      {/* ★2026-11-17 円と曲線の版。正本は designs/lp-creative/sections/targets-pc.png・cta-pc.png。
          こういう人向け：6つの悩みを両端が半円の白い札にし、札の左に考える表情の人の丸い写真。下に一言の丸い帯。
          呼びかけ：淡い水色の地で上下は波。左に見出しとボタン、右に横長の楕円の写真と、それに重なる白い箱（AI に聞く）。 */}

      {/* ===== こういう人向け ===== */}
      <div className="lp-sec relative bg-white">
        <span aria-hidden="true" className="dot w-24 h-24 lg:w-[150px] lg:h-[150px] -right-8 lg:-right-[16px] -top-6 lg:-top-[10px]" />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-[64px] relative z-10">
          <div className="anim-hidden anim-up mb-7 lg:mb-9">
            <h2 className="text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] font-black jp-display text-ink">
              <span className="text-brand-700">こういう人</span>向け
            </h2>
          </div>

          <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-x-5 lg:gap-y-5">
            {TARGETS.map((text, i) => (
              <li
                key={text}
                className="anim-hidden anim-up flex items-center gap-4 lg:gap-5 rounded-full bg-white shadow-[0_10px_28px_-14px_rgba(11,27,46,0.2)] ring-1 ring-[#E3F2FA] p-2.5 pr-6 lg:p-3 lg:pr-8 min-h-[96px] xl:min-h-[140px]"
              >
                <span className="relative shrink-0 w-[76px] h-[76px] lg:w-[100px] lg:h-[100px] xl:w-[116px] xl:h-[116px] rounded-full overflow-hidden bg-mist">
                  <ImageFrame slot={`target.0${i + 1}`} fill density="compact" hideChip imgClassName="object-[50%_30%]" />
                </span>
                <p className="jp-phrase text-[15px] lg:text-[16px] xl:text-[17px] leading-[1.65] font-medium text-ink">{text}</p>
              </li>
            ))}
          </ul>

          <div className="anim-hidden anim-up mt-8 lg:mt-10 text-center">
            <p className="inline-block rounded-full bg-[#E9F7FE] px-7 sm:px-14 py-4 lg:py-5 text-ink font-black text-[15px] sm:text-base lg:text-[20px] [word-break:keep-all] [overflow-wrap:anywhere]">
              <span className="text-brand-700">当てはまる物があれば、</span>下から無料で相談できます。
            </p>
          </div>
        </div>
      </div>

      {/* ===== 呼びかけ（お問い合わせ） ===== */}
      <div className="lp-sec lp-sec-wave relative bg-mist">
        <div aria-hidden="true" className="wave wave-top [--from:#ffffff]" />
        <div aria-hidden="true" className="wave wave-bottom [--from:#ffffff]" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-[68px] relative z-10 grid xl:grid-cols-[minmax(0,500px)_minmax(0,1fr)] gap-x-6 gap-y-10 items-center">
          {/* 見出し・説明・ボタン・連絡先 */}
          <div className="anim-hidden anim-left">
            <h2 className="text-[27px] min-[375px]:text-[31px] sm:text-[44px] xl:text-[52px] leading-[1.25] font-black text-ink tracking-tight mb-5 lg:mb-6 whitespace-nowrap">
              まずは無料で、<br /><span className="text-brand-700">話を聞いてください。</span>
            </h2>
            <p className="jp-text text-[15px] sm:text-lg lg:text-[20px] text-ink-soft font-medium leading-[1.8] max-w-[24em] mb-7 lg:mb-9">
              資料請求のページから、資料のお届けとご質問の受け付けをしています。
            </p>
            {/* 相談の行き先（LMS の資料請求）と連絡先 */}
            <a
              href={REQUEST_URL}
              className="group mb-5 inline-flex items-center gap-3 min-h-[56px] lg:min-h-[64px] px-6 sm:px-8 lg:px-12 rounded-2xl bg-brand-500 text-ink text-[15px] min-[375px]:text-base sm:text-lg lg:text-[20px] font-black whitespace-nowrap shadow-cta hover:bg-brand-400 transition-colors duration-300"
            >
              無料で資料請求・相談する
              <GenIcon name="arrow-right" className="w-6 h-6 lg:w-7 lg:h-7 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <p className="text-sm sm:text-[15px] lg:text-base text-ink">
              <span className="font-bold">メール：</span>support@techstars.studio
            </p>
          </div>

          {/* 右：楕円の写真と、それに重なる AI 診断の箱（相談の受け口ではない。答えるのは AI） */}
          <div className="relative min-h-0 xl:min-h-[500px]">
            <span aria-hidden="true" className="dot hidden sm:block w-[200px] h-[180px] right-[17%] -top-[10px]" />
            <span aria-hidden="true" className="dot dot-deep hidden sm:block w-[86px] h-[86px] right-[8%] -bottom-[24px] xl:bottom-[0px] opacity-80" />
            <div className="anim-hidden anim-scale relative w-full sm:w-[64%] xl:w-[62%] aspect-[540/505] cta-oval overflow-hidden bg-white xl:absolute xl:left-0 xl:top-0">
              <ImageFrame slot="cta.person" fill density="compact" imgClassName="object-[50%_35%]" />
            </div>
            <div className="anim-hidden anim-right relative z-10 -mt-14 sm:-mt-[40%] sm:ml-auto xl:mt-0 xl:absolute xl:right-0 xl:top-[86px] w-full sm:w-[58%] xl:w-[60%]">
              <div className="overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-slate-200/70">
                <div className="p-5 sm:p-6 lg:p-8">
                  <h3 className="mb-1.5 text-xl sm:text-2xl lg:text-[28px] font-black text-ink">AIにその場で聞く</h3>
                  <p className="mb-5 text-sm lg:text-[15px] text-ink-soft leading-relaxed text-pretty">
                    答えるのはAIです。資料やご質問は「無料で資料請求・相談する」からどうぞ。
                  </p>
                  {isVisible ? (
                    <Suspense fallback={<ValidatorSkeleton />}>
                      <IdeaValidator />
                    </Suspense>
                  ) : (
                    <ValidatorSkeleton />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
