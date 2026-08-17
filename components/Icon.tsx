import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { getSlot } from '../content/imageSlots';
import { hasImage } from '../content/generatedImages';

/**
 * Icon — 線アイコンを、実際にレンダリングされた立体オブジェクトの画像に差し替える。
 *
 * ImageFrame と違い、未生成のときはハッチ枠ではなく **元の lucide アイコンに戻る**。
 * アイコンは面積が小さく、そこにプレースホルダーが出ると崩れて見えるため。
 * つまり画像を用意していなくても、今までどおりの見た目で成立する。
 *
 * 画像は真っ黒背景で作る前提。mix-blend-screen で合成するので黒が抜け、
 * 発光部分だけが残る。透過PNGを用意する必要がない。
 */

interface IconProps {
  /** content/imageSlots.ts の icon.* スロットID */
  slot: string;
  /** 画像が無いときに表示する lucide アイコン */
  fallback: LucideIcon;
  /** 表示サイズ（px）。画像・アイコン共通 */
  size?: number;
  /** fallback アイコンに当てるクラス（色など） */
  className?: string;
}

/**
 * 存在判定はビルド時の一覧（content/generatedImages.ts）で行う。
 *
 * 以前は new Image() で毎回読みに行っていたため、未生成の
 * icon.legacy / icon.ai / icon.client / icon.community について
 * ページを開くたびに 404 が4本飛んでいた。しかも判定が非同期なので、
 * 生成済みのアイコンも一度 lucide で描いてから差し替わる二度手間だった。
 */
export const Icon: React.FC<IconProps> = ({ slot, fallback: Fallback, size = 48, className = '' }) => {
  const def = getSlot(slot);
  const src = def?.desktop.src;
  const ready = !!src && hasImage(src);

  if (ready && src) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="mix-blend-screen select-none"
        style={{ width: size, height: size }}
      />
    );
  }

  // 画像が無い間は元の線アイコン。サイズだけ揃える
  return <Fallback aria-hidden="true" className={className} style={{ width: size * 0.5, height: size * 0.5 }} />;
};
