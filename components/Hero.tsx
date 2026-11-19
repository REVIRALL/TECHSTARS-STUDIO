import React from 'react';
import { SectionId } from '../types';
import { ImageFrame } from './ImageFrame';
import { GenIcon } from './GenIcon';
import { REQUEST_URL } from '../content/links';
import { withImgVersion } from '../content/imgVersion';

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
 *  ★2026-11-17 依頼主「ここの手前のレイヤーに文字重ねないと。なんで？」（スマホの最初の画面で、字が写真に1つも重なっていなかった）。
 *    原因：白いかすみが写真の上半分を白で塗りつぶし、写真は下に寄せて人物が字から逃げ、字は画面の上半分を使っていた。
 *    → スマホ・タブレット（lg 未満）だけ：白いかすみを外し、字の塊を画面の下に寄せて、写真の手前に白い字で重ねる。
 *      字の後ろは下から濃い紺のぼかし（字の塊に付けて伸び縮み）。見出しの2行目は紺の地で読める明るいシアン（brand-300）。
 *      写真は下を支点に 1.35 倍にして、2人の顔を画面の上〜中ほどへ上げる（タブレットは等倍で顔が上半分に来る）。
 *      背の低いスマホ（高さ 600px 以下・320x568 など）は字の塊が画面の4割を超えるので、1.55 倍にして顔をもう一段上げ、下の余白を少し詰める。
 *      文は変えず、大きさと間隔だけ詰めた。「カリキュラムを見る」は白い札をやめ、白い字の文字リンク。PC（lg 以上）は変えない。
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
  <dl className={`grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-y-6 justify-items-center lg:flex lg:flex-nowrap lg:justify-center lg:gap-x-10 xl:gap-x-14 ${className}`}>
    {STATS.map((s) => (
      <div
        key={s.value}
        className="group relative h-[136px] sm:h-[150px] lg:h-[168px] xl:h-[184px] transition-transform duration-300 hover:-translate-y-1"
        style={{ aspectRatio: `${s.w} / ${s.h}` }}
      >
        {/* ★2026-11-19 読み込みを軽く：同じ絵の avif（画質 70・1枚 57KB→38KB）を先に。読めないブラウザは今までの webp */}
        <picture>
          <source type="image/avif" srcSet={withImgVersion(s.img.replace(/\.webp$/, '.avif'))} />
          <img
            src={withImgVersion(s.img)}
            width={s.w}
            height={s.h}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 h-full w-full select-none [filter:drop-shadow(0_8px_14px_rgba(11,27,46,0.18))]"
          />
        </picture>
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
    <section id={SectionId.Home} className="relative bg-white text-ink overflow-x-clip">
      {/* ★2026-11-17 円と曲線の版。正本は designs/lp-creative/sections/fv-pc.png（PC）・fv-sp.png（スマホ）。
          PC：右に写真を大きな丸みの形（.hero-blob）で切り抜き、まわりに淡い水色の円。エンブレムは写真の下に中央でまとめて並べ、
          下の端は波の境。スマホ：決まりどおり写真を画面いっぱい（100svh・下限540px）に敷き、字はその上（字の下に白いかすみ）。 */}
      {/* 地の円の色面（絵の位置。字にかからない所だけ） */}
      <span aria-hidden="true" className="dot hidden lg:block w-[124px] h-[124px] left-[28%] -top-[22px]" />
      <span aria-hidden="true" className="dot hidden lg:block w-10 h-10 left-[26.5%] top-[92px]" />
      <span aria-hidden="true" className="dot hidden lg:block w-[30px] h-[30px] left-[2.2%] top-[166px]" />
      <span aria-hidden="true" className="dot hidden lg:block w-[72px] h-[72px] left-[33.6%] top-[200px]" />
      <span aria-hidden="true" className="dot hidden lg:block w-20 h-20 right-[1.8%] top-[653px] z-10" />
      <span aria-hidden="true" className="dot hidden lg:block w-11 h-11 right-[7.3%] top-[743px] z-10" />

      {/* ===== 写真の舞台。スマホはぴったり1画面 ===== */}
      <div className="relative h-[100svh] min-h-[540px] lg:h-auto lg:min-h-0 flex flex-col">
        {/* 写真：スマホは全面、PC は右の丸みの形 */}
        <div className="absolute inset-0 z-0 overflow-hidden lg:inset-auto lg:left-[46.2%] lg:right-[-1px] lg:top-[88px] lg:h-[min(42.5vw,640px)] hero-blob">
          <ImageFrame
            slot="hero.backdrop"
            fill
            priority
            imgClassName="object-cover object-[58%_100%] scale-[1.35] max-md:[@media(max-height:600px)]:scale-[1.55] origin-[50%_100%] md:object-[72%_100%] md:scale-100 lg:object-[84%_42%] lg:scale-[1.22] lg:origin-[80%_42%]"
            placeholderClassName="opacity-60"
            chipPosition="top-24 right-4"
          />
        </div>
        {/* スマホは写真の下の端を白い弧にする（絵 fv-sp の写真の丸み） */}
        <div aria-hidden="true" className="lg:hidden absolute z-[25] -left-[35%] w-[130%] -bottom-[46px] h-[96px] rounded-[50%] bg-white pointer-events-none" />
        {/* スマホの画面の端の円（絵 fv-sp の右上・左下の円） */}
        <span aria-hidden="true" className="dot lg:hidden z-[1] w-[120px] h-[120px] -right-[36px] -top-[44px] opacity-90" />
        <span aria-hidden="true" className="dot lg:hidden z-[1] w-9 h-9 right-[30%] top-[40px] opacity-90" />

        {/* ===== 本文 ===== */}
        <div className="relative z-20 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-[86px] pt-[104px] sm:pt-32 lg:pt-[196px] pb-16 max-md:[@media(max-height:600px)]:pb-14 lg:pb-0 flex-1 flex flex-col justify-end lg:justify-start">
          {/* 字の塊（見出し・説明・2つのボタン）。スマホ・タブレットは写真の手前に白い字で重ねる */}
          <div className="relative">
          {/* 字の後ろの濃い紺のぼかし（スマホ・タブレット）。字の塊の上 120px からなめらかに濃くなり、字の上端で 0.8・下で 0.86。
              字の塊の高さに合わせて伸び縮みするので、どの画面の高さでも字の後ろは同じ濃さになる（白い字で 4.5:1 以上）。
              下の端は画面の下の白い弧の後ろへ入る */}
          <div
            aria-hidden="true"
            className="lg:hidden absolute -z-10 -inset-x-5 sm:-inset-x-8 -top-[120px] -bottom-16 max-md:[@media(max-height:600px)]:-bottom-14 pointer-events-none bg-[linear-gradient(180deg,rgba(8,24,48,0)_0px,rgba(8,24,48,0.1)_24px,rgba(8,24,48,0.28)_52px,rgba(8,24,48,0.52)_80px,rgba(8,24,48,0.72)_104px,rgba(8,24,48,0.8)_120px,rgba(8,24,48,0.86)_100%)]"
          />
          {/* 主役。最初に描く物なので動かさない。
              ★2026-11-17 文の直し（fix-copy #1）：「7日間で プロへ。」→「7日間で、」「動くシステムを3つ作る。」。
              2行目（全角10字＋数字）が 360px 幅でも1行に収まる大きさ（8.2vw）にし、1行目はそれより一回り大きくする */}
          <h1 className="mb-3 sm:mb-5 lg:mb-7 font-black tracking-[-0.02em] leading-[1.18]">
            <span className="block text-[10.5vw] sm:text-[9.5vw] lg:text-[5.6vw] xl:text-[80px] [@media(max-height:700px)]:text-[10vw] lg:[@media(max-height:700px)]:text-[5.4vw] text-white lg:text-ink">
              7日間で、
            </span>
            <span className="block whitespace-nowrap text-[8.2vw] sm:text-[7.2vw] lg:text-[3.9vw] xl:text-[56px] [@media(max-height:700px)]:text-[7.6vw] lg:[@media(max-height:700px)]:text-[3.9vw] text-brand-300 lg:text-brand-700">
              動くシステムを3つ作る。
            </span>
          </h1>

          {/* ★2026-11-17 fix-copy #2：説明は1文に（作る3つの物・講師と1対1） */}
          <p className="fv-in fv-in-2 max-w-[30.5em] mb-4 sm:mb-6 lg:mb-8 text-[15px] sm:text-lg lg:text-[21px] xl:text-[22px] leading-[1.7] lg:leading-[1.6] font-medium text-white lg:text-ink [@media(max-height:700px)]:text-[14px] [word-break:keep-all] [overflow-wrap:anywhere]">
            Webサイト・業務の自動化・データベースを使うWebアプリを、講師と1対1で作ります。
          </p>

          {/* CTA。ファーストビュー内に必ず置く */}
          <div className="fv-in fv-in-3 flex flex-wrap items-center gap-x-5 gap-y-1 max-md:[@media(max-height:600px)]:gap-y-0 sm:gap-x-8 lg:gap-y-2">
            {/* ★2026-11-17 fix-copy #15：行き先を AI 診断の箱から LMS の資料請求へ */}
            <a
              href={REQUEST_URL}
              className="group inline-flex items-center gap-3 min-h-[52px] sm:min-h-[56px] lg:min-h-[72px] px-6 sm:px-7 lg:px-12 rounded-2xl bg-brand-500 text-ink text-base sm:text-lg lg:text-[22px] font-black tracking-tight shadow-cta hover:bg-brand-400 transition-colors duration-300"
            >
              無料で詳細を見る
              <GenIcon name="arrow-right" className="w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-1 transition-transform duration-300" eager />
            </a>
            {/* スマホ・タブレットは紺のぼかしの上なので、白い字の文字リンク（押せると分かるよう下線つき）。PC は今のまま */}
            <a
              href={`#${SectionId.Portfolio}`}
              className="inline-flex items-center min-h-[44px] text-[15px] sm:text-base lg:text-[19px] font-black text-white underline decoration-2 underline-offset-[6px] lg:text-brand-700 lg:no-underline lg:hover:underline lg:decoration-auto lg:underline-offset-4"
            >
              カリキュラムを見る
            </a>
          </div>
          </div>

          {/* PC は写真の下にかけて、エンブレム4つを中央にまとめて並べる（絵 fv-pc の位置） */}
          <Emblems className="fv-in fv-in-3 hidden lg:flex mt-5 pb-[112px] relative z-20" />
        </div>
      </div>

      {/* スマホ・タブレットは1画面の写真の下にエンブレムを置く（1画面に字と写真と4つを詰めない） */}
      <div className="lg:hidden relative bg-white px-5 pt-8 pb-16">
        <span aria-hidden="true" className="dot w-12 h-12 -left-3 bottom-24" />
        <span aria-hidden="true" className="dot w-16 h-16 -right-4 top-6" />
        <Emblems className="relative z-10" />
      </div>

      {/* 下の端の波（次の区画の頭の淡い水色の帯へつながる） */}
      <div aria-hidden="true" className="wave wave-bottom [--from:#EDF8FD]" />
    </section>
  );
};
