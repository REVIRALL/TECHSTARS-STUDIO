import React, { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { getSlot } from '../content/imageSlots';

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

/** 同じ画像を複数箇所で使うので、存在判定はモジュール単位で共有する */
const probeCache = new Map<string, Promise<boolean>>();

function probe(src: string): Promise<boolean> {
  let p = probeCache.get(src);
  if (!p) {
    p = new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
    probeCache.set(src, p);
  }
  return p;
}

export const Icon: React.FC<IconProps> = ({ slot, fallback: Fallback, size = 48, className = '' }) => {
  const def = getSlot(slot);
  const src = def?.desktop.src;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    probe(src).then((ok) => {
      if (!cancelled) setReady(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

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
