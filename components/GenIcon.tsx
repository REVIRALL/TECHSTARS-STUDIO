import React from 'react';

/**
 * 画像の印（アイコン）。線のアイコン（lucide-react）の代わりに使う。
 *
 * ★2026-11-16 ユーザーの決まり「svgっぽいアイコンは使わないで、完全にすべて画像生成のデザインのみ」（11/03）。
 *   GPT に画風の4案を描かせ、ユーザーが「2で」＝白い陶器の小さな立体（つや消しの白にシアンの差し色）を選んだ。
 * ★2026-11-17 依頼主「SVGみたいなやつが立体的すぎておかしい」→ 平たい印の4案から「３」＝紙の切り抜き
 *   （色紙を切り抜いて重ねたような平たい色面・シアン・淡い水色・紺・紙の厚みのごく薄い影だけ）に替えた。
 *   1つずつ背景を透明で描かせ、余白を切って 128px の正方形の WebP にした（public/img/icons/・名前は前と同じ）。
 *   描かせた台本と元の絵は LMS 側の作業場 designs/lp-creative（gen_lp_icons3.py・icons3/）にある。
 *
 * ★印は飾り＝読み上げに渡さない（alt を空・aria-hidden）。意味は隣の文字が持つ。
 *   ボタンの中身が印だけになる所（メニューの開閉など）は、ボタンの側に aria-label を付ける。
 */
export type GenIconName =
  | 'alert'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'bar-chart'
  | 'briefcase'
  | 'calendar-clock'
  | 'check'
  | 'check-circle'
  | 'circle-dashed'
  | 'close'
  | 'copy'
  | 'database'
  | 'download'
  | 'file-text'
  | 'globe'
  | 'image'
  | 'laptop'
  | 'layers'
  | 'loader'
  | 'lock'
  | 'mail'
  | 'menu'
  | 'monitor'
  | 'rotate'
  | 'settings'
  | 'shield'
  | 'shield-check'
  | 'smartphone'
  | 'sparkles'
  | 'terminal'
  | 'users';

interface Props {
  name: GenIconName;
  className?: string;
  /** 最初の画面など、すぐ見える所だけ true（遅れて読ませない） */
  eager?: boolean;
}

export const GenIcon: React.FC<Props> = ({ name, className = 'w-5 h-5', eager = false }) => (
  <img
    src={`/img/icons/${name}.webp`}
    alt=""
    aria-hidden="true"
    width={128}
    height={128}
    decoding="async"
    loading={eager ? 'eager' : 'lazy'}
    draggable={false}
    className={`inline-block shrink-0 object-contain select-none ${className}`}
  />
);
