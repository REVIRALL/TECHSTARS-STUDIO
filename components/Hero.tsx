import React from 'react';
import { SectionId } from '../types';
import { ImageFrame } from './ImageFrame';
import { GenIcon } from './GenIcon';

/**
 * ヒーロー。
 *
 * ★2026-11-16 明るい人物の版に組み直した。
 *  - 正本の絵は designs/lp-stats/variants/2-section-fv/v2.png（ユーザーが5案から「２で。」と選んだ「1:1 で教わる」）。
 *    明るいコワーキングで講師と受講生が1台の画面をのぞき込んで笑う写真が右、左は白い地に見出し、差し色はシアン。
 *    前は暗い近未来の都市とシルエットで「トップページもうちょい明るい人物系にしたいかも。暗いから」と言われた。
 *  - 写真は v2 の場面を字と UI を抜いて描き直した物（PC 16:9・スマホ 9:16。content/imageSlots.ts の hero.backdrop）。
 *  - スマホは写真を画面いっぱい（100svh・下限540px）に敷き、字はその上（字の下に白いかすみ）。
 *    2人は写真の下の半分にいるので、object-position を下に寄せて主役を必ず画面に入れる。
 *  - 実績の4つは「王冠のエンブレム」。前の回にユーザーが5（王冠のエンブレム）を選び、
 *    「エンブレムだけはこの派手さでいいけど背景とかは透過して」。字の無い透明の画像（public/img/emblem-*.webp）の
 *    盾の内側に、字をサイトの文字として載せる（読み上げと検索のため。画像に焼き込まない）。
 *  - 白い地の上の水色の字は #0675AD（brand-700・白地で 5.0:1）。正本の明るいシアン（#00B2ED）は白地で 2.4:1 しか無いので字には使わない。
 *  - 見出しの h1 と写真（最初に描く物）は動かさない。下の段の字とボタンだけ読み込み時に一度だけ出す。
 *  - 前に右下に置いていた「SCROLL」と細い線は外した（飾りの線を引かない・正本の絵にも無い）。
 */

/**
 * label は盾の内側で折り返す位置を決めて行に分けてある（自然な折り返しだと「作/る」のように切れる）。
 * img の幅と高さは画像の実寸（読み込み中に高さがずれないように）。
 */
/*
  ★2026-11-17 エンブレムの2回目。ユーザー「王冠はもうちょっとLPに使われてるような感じで。真ん中が黒い青だと暗い感じになるから、
    白系がいいかも真ん中は。王冠自体は金でいいけど」→ 白系の5案から「４」＝金の月桂樹の輪の中に白い円・上に金の王冠
    （public/img/crown-*.webp・字の無い透明の画像。描かせた台本は LMS 側の designs/lp-emblem2）。
    「もう一回りサイズ小さくてもいいかも。今の主張強いので」→ 高さを PC 226→184px・スマホ 150→136px に。
    字は白い円の内側（画像の横 19〜80%・縦 26〜83% を測った値）に、紺と読める濃さの青で載せる。
*/
const STATS = [
  { value: '7', unit: '日間', label: ['最短で完走'], img: '/img/crown-1.webp', w: 412, h: 420 },
  { value: '3', unit: '種', label: ['動くシステム', 'を作る'], img: '/img/crown-2.webp', w: 404, h: 420 },
  { value: '1:1', unit: '', label: ['マンツーマン', '指導'], img: '/img/crown-3.webp', w: 400, h: 420 },
  { value: '∞', unit: '', label: ['卒業後も', 'つながる'], img: '/img/crown-4.webp', w: 396, h: 420 },
];

const Emblems: React.FC<{ className?: string }> = ({ className = '' }) => (
  <dl className={`grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-y-6 justify-items-center lg:flex lg:flex-nowrap lg:justify-center lg:gap-x-6 xl:gap-x-8 ${className}`}>
    {STATS.map((s) => (
      <div
        key={s.value}
        className="group relative h-[136px] sm:h-[150px] lg:h-[168px] xl:h-[184px] transition-transform duration-300 hover:-translate-y-1"
        style={{ aspectRatio: `${s.w} / ${s.h}` }}
      >
        <img
          src={s.img}
          width={s.w}
          height={s.h}
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute inset-0 h-full w-full select-none [filter:drop-shadow(0_8px_14px_rgba(11,27,46,0.18))]"
        />
        <div className="absolute inset-x-[22%] top-[29%] bottom-[19%] flex flex-col items-center justify-center text-center">
          <dd className="flex items-baseline justify-center gap-0.5 leading-none">
            <span className="text-[26px] sm:text-[30px] lg:text-[34px] xl:text-[38px] font-black tracking-[-0.04em] tabular-nums text-brand-700">
              {s.value}
            </span>
            {s.unit && (
              <span className="text-[12px] sm:text-[13px] lg:text-[14px] xl:text-[15px] font-black text-brand-700">
                {s.unit}
              </span>
            )}
          </dd>
          <dt className="mt-1 sm:mt-1.5 text-[12px] xl:text-[13px] font-bold leading-[1.35] tracking-[0.02em] text-ink">
            {s.label.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </dt>
        </div>
      </div>
    ))}
  </dl>
);

export const Hero: React.FC = () => {
  return (
    <section id={SectionId.Home} className="relative bg-white text-ink overflow-hidden">
      {/* ===== 写真の舞台。スマホはぴったり1画面、PC は最低 880px ===== */}
      <div className="relative h-[100svh] min-h-[540px] lg:h-auto lg:min-h-[max(100svh,880px)] flex flex-col">
        <div className="absolute inset-0 z-0">
          <ImageFrame
            slot="hero.backdrop"
            fill
            priority
            imgClassName="object-cover object-[50%_100%] md:object-[72%_100%] lg:object-[70%_center]"
            placeholderClassName="opacity-60"
            chipPosition="top-24 right-4"
          >
            {/* 字の下だけ白いかすみを敷く。スマホは上から、PC は左から */}
            <div className="absolute inset-0 pointer-events-none lg:hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.86)_34%,rgba(255,255,255,0.45)_52%,rgba(255,255,255,0)_66%)]" />
            <div className="absolute inset-0 pointer-events-none hidden lg:block bg-[linear-gradient(90deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.9)_26%,rgba(255,255,255,0.55)_42%,rgba(255,255,255,0)_58%)]" />
          </ImageFrame>
        </div>

        {/* ===== 本文 ===== */}
        <div className="relative z-20 w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-[88px] pt-[88px] sm:pt-28 lg:pt-[150px] pb-8 lg:pb-12 flex-1 flex flex-col">
          <p className="fv-in mb-3 sm:mb-5 lg:mb-6 font-mono font-bold text-[12px] sm:text-[13px] lg:text-[15px] tracking-[0.36em] lg:tracking-[0.42em] text-brand-700">
            AI ENGINEER BOOTCAMP
          </p>

          {/* 主役。最初に描く物なので動かさない */}
          <h1 className="mb-4 sm:mb-7 lg:mb-8 font-black tracking-[-0.02em] leading-[1.02]">
            <span className="block text-[15vw] sm:text-[12vw] lg:text-[8vw] xl:text-[118px] [@media(max-height:700px)]:text-[12.5vw] lg:[@media(max-height:700px)]:text-[7vw] text-ink">
              7日間で
            </span>
            <span className="block text-[15vw] sm:text-[12vw] lg:text-[8vw] xl:text-[118px] [@media(max-height:700px)]:text-[12.5vw] lg:[@media(max-height:700px)]:text-[7vw] text-brand-700">
              プロへ。
            </span>
          </h1>

          <p className="fv-in fv-in-2 max-w-[30em] mb-5 sm:mb-8 lg:mb-9 text-[15px] sm:text-lg lg:text-[22px] leading-[1.75] lg:leading-[1.65] font-medium text-ink [@media(max-height:700px)]:text-[14px]">
            コードは書かない。<span className="font-bold">AIに指示を出す。</span>
            <br className="hidden sm:block" />
            7日後、動くシステムが3つ、手元に残る。
          </p>

          {/* CTA。ファーストビュー内に必ず置く */}
          <div className="fv-in fv-in-3 flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8">
            <a
              href={`#${SectionId.Contact}`}
              className="group inline-flex items-center gap-3 min-h-[56px] lg:min-h-[68px] px-7 lg:px-10 rounded-xl bg-gradient-to-b from-brand-400 to-brand-500 text-ink text-base sm:text-lg lg:text-[22px] font-black tracking-tight shadow-cta hover:to-brand-600 transition-colors duration-300"
            >
              無料で詳細を見る
              <GenIcon name="arrow-right" className="w-6 h-6 lg:w-7 lg:h-7 group-hover:translate-x-1 transition-transform duration-300" eager />
            </a>
            <a
              href={`#${SectionId.Portfolio}`}
              className="inline-flex items-center min-h-[44px] text-sm sm:text-base lg:text-[17px] font-bold text-brand-700 hover:underline underline-offset-4"
            >
              カリキュラムを見る
            </a>
          </div>

          {/* PC は写真の上、画面の下の中央にエンブレムを並べる（正本の絵の位置） */}
          <Emblems className="fv-in fv-in-3 hidden lg:flex mt-auto pt-8" />
        </div>
      </div>

      {/* スマホ・タブレットは1画面の写真の下にエンブレムを置く（1画面に字と写真と4つを詰めない） */}
      <div className="lg:hidden relative bg-gradient-to-b from-white to-mist px-5 pt-8 pb-10">
        <Emblems />
      </div>
    </section>
  );
};
