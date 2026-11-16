import React from 'react';
import { SectionId } from '../types';
import { ArrowRight } from 'lucide-react';
import { ImageFrame } from './ImageFrame';

/**
 * ヒーロー。
 *
 * 方針:
 *  - 主役は「7日間で / プロへ。」の一行だけ。他は全部それを支える脇役に落とす
 *  - 枠線で構造を作らない。余白・階層・光で作る
 *  - ★2026-11-16 実績の4つは「王冠のエンブレム」に置き換えた。
 *    前は大きな数字を縦線で区切った帯で、「AIっぽい。もっと王冠の画像作って配置とかにしたい」「LPっぽく」と言われた。
 *    GPT に描かせた5案からユーザーが5（王冠のエンブレム）を選び、「エンブレムだけはこの派手さでいいけど背景とかは透過して」。
 *    エンブレムは字の無い透明の画像（public/img/emblem-*.webp）で、字はサイトの文字として盾の内側に載せる
 *    （読み上げと検索のため。画像に焼き込まない）。案の絵は designs/lp-stats（LMS 側の作業場）にある。
 *  - LPなのでファーストビュー内にCTAを置く
 */

/**
 * label は盾の内側で折り返す位置を決めて行に分けてある（自然な折り返しだと「作/る」のように切れる）。
 * img の幅と高さは画像の実寸（読み込み中に高さがずれないように）。
 */
const STATS = [
  { value: '7', unit: '日間', label: ['最短で完走'], img: '/img/emblem-1.webp', w: 394, h: 420 },
  { value: '3', unit: '種', label: ['動くシステム', 'を作る'], img: '/img/emblem-2.webp', w: 370, h: 420 },
  { value: '1:1', unit: '', label: ['マンツーマン', '指導'], img: '/img/emblem-3.webp', w: 354, h: 420 },
  { value: '∞', unit: '', label: ['卒業後も', 'つながる'], img: '/img/emblem-4.webp', w: 368, h: 420 },
];

export const Hero: React.FC = () => {
  return (
    <section
      id={SectionId.Home}
      className="relative min-h-[100svh] flex flex-col justify-end bg-black text-white overflow-hidden"
    >
      {/* ===== 背景 ===== */}
      <div className="absolute inset-0 z-0">
        <ImageFrame
          slot="hero.backdrop"
          fill
          priority
          imgClassName="object-cover object-[70%_center] sm:object-center"
          placeholderClassName="opacity-60"
          chipPosition="top-24 right-4"
        >
          {/* 画像を潰さず、文字が乗る側だけを落とす。
              一枚の斜めグラデで「左が暗く、右に光が残る」状態を作る */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(100deg,#000_18%,rgba(0,0,0,0.86)_42%,rgba(0,0,0,0.35)_72%,rgba(0,0,0,0.1)_100%)]" />
          {/* 上下だけ締めて、次のセクションへ黒で繋ぐ */}
          <div className="absolute inset-x-0 top-0 h-40 pointer-events-none bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none bg-gradient-to-t from-black via-black/70 to-transparent" />
        </ImageFrame>
      </div>

      {/* ===== 本文 ===== */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-10 sm:pb-14">
        {/* 見出し上のひと言。★2026-11-16 前に置いていた短い横線は外した（見出しのまわりに飾りの線を引かない） */}
        <div className="flex items-center gap-4 mb-7 sm:mb-9 opacity-0 animate-hero-badge">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] text-brand-400">
            AI ENGINEER BOOTCAMP
          </span>
        </div>

        {/* 主役 */}
        <h1 className="opacity-0 animate-hero-title mb-8 sm:mb-10">
          <span className="block text-[15vw] sm:text-[12.5vw] lg:text-[10.5vw] xl:text-[9.5vw] leading-[0.82] font-black tracking-[-0.045em] text-white/95">
            7日間で
          </span>
          <span className="block text-[15vw] sm:text-[12.5vw] lg:text-[10.5vw] xl:text-[9.5vw] leading-[0.82] font-black tracking-[-0.045em] text-brand-500 [text-shadow:0_0_90px_rgba(0,229,255,0.5)]">
            プロへ。
          </span>
        </h1>

        {/* 支える一文。カードに入れず、素のまま置く */}
        <div className="opacity-0 animate-hero-desc max-w-[34ch] sm:max-w-[46ch] mb-9 sm:mb-11">
          <p className="text-base sm:text-lg lg:text-xl leading-[1.85] text-slate-300">
            コードは書かない。<span className="text-white font-semibold">AIに指示を出す。</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            7日後、動くシステムが3つ、手元に残る。
          </p>
        </div>

        {/* CTA。ファーストビュー内に必ず置く */}
        <div className="opacity-0 animate-hero-desc flex flex-wrap items-center gap-3 sm:gap-4 mb-14 sm:mb-20">
          <a
            href={`#${SectionId.Contact}`}
            className="group inline-flex items-center gap-2.5 bg-white text-black pl-6 pr-5 py-3.5 sm:py-4 text-sm sm:text-base font-bold tracking-tight hover:bg-brand-500 transition-colors duration-300"
          >
            無料で詳細を見る
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
          <a
            href={`#${SectionId.Portfolio}`}
            className="inline-flex items-center gap-2 px-1 py-3.5 sm:py-4 text-sm sm:text-base text-slate-300 hover:text-brand-400 transition-colors border-b border-transparent hover:border-brand-400"
          >
            カリキュラムを見る
          </a>
        </div>

        {/* 実績の4つ。王冠のエンブレム（字の無い透明の画像）の盾の内側に、字を重ねる。
            盾の内側は画像の横 22〜78%・縦 31〜72%（4枚を測った値）。区切りの線は引かない。
            PC は左に寄せてまとめる（横いっぱいに散らすと、4つ目が背景の人物の上に乗った） */}
        <dl className="opacity-0 animate-hero-cards grid grid-cols-2 gap-x-2 gap-y-5 sm:gap-y-6 justify-items-center lg:flex lg:flex-wrap lg:gap-x-10">
          {STATS.map((s) => (
            <div
              key={s.value}
              className="group relative h-[150px] sm:h-[176px] lg:h-[196px] transition-transform duration-300 hover:-translate-y-1"
              style={{ aspectRatio: `${s.w} / ${s.h}` }}
            >
              <img
                src={s.img}
                width={s.w}
                height={s.h}
                alt=""
                aria-hidden="true"
                decoding="async"
                className="absolute inset-0 h-full w-full select-none [filter:drop-shadow(0_10px_24px_rgba(0,0,0,0.55))]"
              />
              <div className="absolute inset-x-[21%] top-[33%] bottom-[27%] flex flex-col items-center justify-center text-center">
                <dd className="flex items-baseline justify-center gap-0.5 leading-none">
                  <span className="text-[30px] sm:text-[36px] lg:text-[40px] font-black tracking-[-0.04em] tabular-nums text-brand-400 [text-shadow:0_0_16px_rgba(0,229,255,0.55)]">
                    {s.value}
                  </span>
                  {s.unit && (
                    <span className="text-[13px] sm:text-[15px] lg:text-base font-black text-brand-400 [text-shadow:0_0_12px_rgba(0,229,255,0.45)]">
                      {s.unit}
                    </span>
                  )}
                </dd>
                <dt className="mt-1.5 sm:mt-2 text-[11px] sm:text-[12px] lg:text-[13px] font-bold leading-[1.35] tracking-[0.02em] text-white">
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
      </div>

      {/* スクロール誘導。細い線が下に伸びるだけ */}
      <div className="hidden lg:flex absolute bottom-0 right-12 z-20 flex-col items-center gap-3 pointer-events-none">
        <span className="font-mono text-[10px] tracking-[0.3em] text-slate-600 [writing-mode:vertical-rl]">
          SCROLL
        </span>
        <span className="w-px h-16 bg-gradient-to-b from-brand-500/60 to-transparent" />
      </div>
    </section>
  );
};
