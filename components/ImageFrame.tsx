import React, { useEffect, useState } from 'react';
import { ImageIcon, Sparkles, Monitor, Smartphone } from 'lucide-react';
import { getSlot, variantFor, Device } from '../content/imageSlots';
import { PromptModal } from './PromptModal';

/**
 * ImageFrame — 「画像に差し替える枠」
 *
 * ・public/img/ に該当ファイルが置かれていれば、その画像を表示する
 *   （PC / モバイルで別カットが定義されている枠は <picture> で自動的に出し分ける）
 * ・まだ置かれていなければ、生成プロンプトを内蔵したプレースホルダー枠を表示する
 *   枠をクリック（fill モードでは PROMPT チップをクリック）すると
 *   そのまま画像生成AIに貼れるプロンプトが開く
 *
 * つまり「画像を作って public/img に置く」だけで完成する。コードの変更は不要。
 */

interface ImageFrameProps {
  /** content/imageSlots.ts の ImageSlot.id */
  slot: string;
  /** 外側ラッパーに足すクラス */
  className?: string;
  /** img 要素に足すクラス（object-position の微調整など） */
  imgClassName?: string;
  /** true にすると親要素を absolute inset-0 で埋める（親に relative が必要） */
  fill?: boolean;
  /** 画像の上に重ねる要素（グラデーションやスキャンライン等） */
  children?: React.ReactNode;
  /** ファーストビューの画像は true（loading=eager / fetchPriority=high） */
  priority?: boolean;
  /** 小さいカード内では 'compact' にして情報量を落とす */
  density?: 'full' | 'compact';
  /** fill モードのとき PROMPT チップを置く位置 */
  chipPosition?: string;
  /**
   * 未生成プレースホルダーの見た目だけに足すクラス。
   * 装飾用の背景枠は `opacity-30` などで弱めて、本文の邪魔をしないようにする
   */
  placeholderClassName?: string;
}

function useDevice(): Device {
  const query = '(max-width: 767px)';
  const [device, setDevice] = useState<Device>(() =>
    typeof window !== 'undefined' && window.matchMedia(query).matches ? 'mobile' : 'desktop'
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setDevice(mq.matches ? 'mobile' : 'desktop');
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return device;
}

function aspectToCss(aspect: string): string {
  const [w, h] = aspect.split(':');
  return `${w} / ${h}`;
}

export const ImageFrame: React.FC<ImageFrameProps> = ({
  slot,
  className = '',
  imgClassName = '',
  fill = false,
  children,
  priority = false,
  density = 'full',
  chipPosition = 'bottom-4 right-4',
  placeholderClassName = '',
}) => {
  const def = getSlot(slot);
  const device = useDevice();
  const [state, setState] = useState<'probing' | 'ready' | 'missing'>('probing');
  const [openPrompt, setOpenPrompt] = useState(false);

  const active = def ? variantFor(def, device) : undefined;

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setState('probing');
    const probe = new Image();
    probe.onload = () => !cancelled && setState('ready');
    probe.onerror = () => !cancelled && setState('missing');
    probe.src = active.src;
    return () => {
      cancelled = true;
    };
  }, [active?.src]);

  if (!def || !active) {
    // スロット定義漏れ。本番で黙って消えるより気づける方がよい
    return (
      <div className={`bg-red-950/40 border border-red-500/50 p-4 font-mono text-xs text-red-400 ${className}`}>
        未定義の画像スロット: {slot}
      </div>
    );
  }

  const wrapperBase = fill
    ? 'absolute inset-0 overflow-hidden'
    : 'relative w-full overflow-hidden';
  const wrapperStyle = fill ? undefined : { aspectRatio: aspectToCss(active.aspect) };

  return (
    <div className={`${wrapperBase} ${className}`} style={wrapperStyle}>
      {/* --- 生成済み: 実画像 --- */}
      {state === 'ready' && (
        <picture>
          {def.mobile && <source media="(max-width: 767px)" srcSet={def.mobile.src} />}
          <img
            src={def.desktop.src}
            alt={def.decorative ? '' : def.alt}
            aria-hidden={def.decorative ? true : undefined}
            width={active.width}
            height={active.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            // @ts-expect-error fetchPriority は React 19 で有効だが型定義が追いついていない場合がある
            fetchpriority={priority ? 'high' : undefined}
            className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
          />
        </picture>
      )}

      {/* --- 判定中: 無音のスケルトン（チラつき防止） --- */}
      {state === 'probing' && <div className="absolute inset-0 bg-[#07080c]" />}

      {/* --- 未生成: プロンプト入りプレースホルダー --- */}
      {state === 'missing' &&
        (fill ? (
          <>
            <div
              className={`absolute inset-0 frame-hatch pointer-events-none ${placeholderClassName}`}
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            </div>
            <button
              type="button"
              onClick={() => setOpenPrompt(true)}
              className={`absolute ${chipPosition} z-20 group pointer-events-auto flex items-center gap-2 px-3 py-2 bg-black/85 backdrop-blur border border-brand-500/50 hover:border-brand-500 hover:bg-brand-500 transition-colors`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500 group-hover:text-black transition-colors" />
              <span className="font-mono text-[10px] tracking-widest text-brand-400 group-hover:text-black transition-colors">
                {def.id} / PROMPT
              </span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setOpenPrompt(true)}
            className={`absolute inset-0 w-full h-full text-left group frame-hatch border border-slate-800 hover:border-brand-500/60 transition-colors ${placeholderClassName}`}
          >
            {/* コーナーブラケット */}
            <span className="absolute top-2 left-2 w-5 h-5 border-l border-t border-brand-500/60 group-hover:border-brand-500 transition-colors" />
            <span className="absolute top-2 right-2 w-5 h-5 border-r border-t border-brand-500/60 group-hover:border-brand-500 transition-colors" />
            <span className="absolute bottom-2 left-2 w-5 h-5 border-l border-b border-brand-500/60 group-hover:border-brand-500 transition-colors" />
            <span className="absolute bottom-2 right-2 w-5 h-5 border-r border-b border-brand-500/60 group-hover:border-brand-500 transition-colors" />

            {/* 走査線 */}
            <span className="absolute inset-0 pointer-events-none frame-scan" />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <ImageIcon className="w-6 h-6 text-brand-500/70 group-hover:text-brand-500 transition-colors" />

              <p className="font-mono text-[9px] sm:text-[10px] text-brand-500 tracking-widest break-all">
                {def.id}
              </p>

              {density === 'full' && (
                <p className="text-xs sm:text-sm font-bold text-white leading-snug">{def.label}</p>
              )}

              <p className="font-mono text-[9px] text-slate-500">
                {active.aspect} · {active.width}×{active.height}
              </p>

              {density === 'full' && (
                <p className="hidden sm:block text-[10px] text-slate-500 leading-relaxed max-w-[36ch] line-clamp-3">
                  {def.role}
                </p>
              )}

              <span className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 border border-brand-500/40 bg-brand-500/10 group-hover:bg-brand-500 transition-colors">
                <Sparkles className="w-3 h-3 text-brand-500 group-hover:text-black transition-colors" />
                <span className="font-mono text-[9px] tracking-widest text-brand-400 group-hover:text-black transition-colors">
                  PROMPT
                </span>
              </span>

              {density === 'full' && (
                <span className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 font-mono text-[8px] text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Monitor className="w-2.5 h-2.5" />PC
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Smartphone className="w-2.5 h-2.5" />
                    {def.mobile ? '専用カット' : '共用'}
                  </span>
                </span>
              )}
            </div>
          </button>
        ))}

      {/* --- 画像の上に重ねる装飾（呼び出し側から渡す） --- */}
      {children}

      {openPrompt && (
        <PromptModal slot={def} initialDevice={device} onClose={() => setOpenPrompt(false)} />
      )}
    </div>
  );
};
