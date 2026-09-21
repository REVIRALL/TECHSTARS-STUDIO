import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Monitor, Smartphone, Download } from 'lucide-react';
import { ImageSlot, Device } from '../content/imageSlots';

interface PromptModalProps {
  slot: ImageSlot;
  initialDevice?: Device;
  onClose: () => void;
}

export function useCopy(): [string | null, (key: string, text: string) => void] {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (key: string, text: string) => {
    const done = () => {
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallback(text, done));
    } else {
      fallback(text, done);
    }
  };
  return [copied, copy];
}

function fallback(text: string, done: () => void) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    done();
  } catch {
    /* コピー不可の環境では手動選択してもらう */
  }
  document.body.removeChild(ta);
}

export const PromptModal: React.FC<PromptModalProps> = ({ slot, initialDevice = 'desktop', onClose }) => {
  const hasMobile = Boolean(slot.mobile);
  const [device, setDevice] = useState<Device>(hasMobile ? initialDevice : 'desktop');
  const [copied, copy] = useCopy();

  const variant = device === 'mobile' ? slot.mobile ?? slot.desktop : slot.desktop;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const download = () => {
    const blob = new Blob([variant.prompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slot.id.replace(/\./g, '-')}-${device}.prompt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`${slot.label} の画像生成プロンプト`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#050507] border border-brand-500/40 shadow-[0_0_60px_-10px_rgba(0,229,255,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="shrink-0 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-start justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-brand-500 tracking-widest truncate">{slot.id}</p>
              <h3 className="text-base sm:text-xl font-bold text-white truncate">{slot.label}</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">{slot.role}</p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* デバイスタブ */}
          <div className="flex items-center gap-2 px-4 sm:px-6 pb-3 flex-wrap">
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] tracking-widest border transition-colors ${
                device === 'desktop'
                  ? 'bg-brand-500 text-black border-brand-500 font-bold'
                  : 'border-slate-700 text-slate-400 hover:border-brand-500/50 hover:text-brand-400'
              }`}
            >
              <Monitor className="w-3 h-3" /> DESKTOP
            </button>
            <button
              onClick={() => hasMobile && setDevice('mobile')}
              disabled={!hasMobile}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] tracking-widest border transition-colors ${
                device === 'mobile'
                  ? 'bg-brand-500 text-black border-brand-500 font-bold'
                  : hasMobile
                  ? 'border-slate-700 text-slate-400 hover:border-brand-500/50 hover:text-brand-400'
                  : 'border-slate-800 text-slate-700 cursor-not-allowed'
              }`}
            >
              <Smartphone className="w-3 h-3" /> MOBILE
            </button>
            {!hasMobile && (
              <span className="font-mono text-[10px] text-slate-500">
                ※この枠はPC画像をモバイルでも共用（別カット不要）
              </span>
            )}
          </div>
        </div>

        {/* 仕様 */}
        <div className="shrink-0 grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800 divide-x divide-slate-800 bg-black">
          <Spec label="ASPECT" value={variant.aspect} />
          <Spec label="MIN SIZE" value={`${variant.width}×${variant.height}`} />
          <Spec label="FORMAT" value="WebP (85%)" />
          <Spec label="SECTION" value={slot.section} />
        </div>

        {/* 保存先 */}
        <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/30">
          <p className="font-mono text-[10px] text-slate-500 mb-1 tracking-widest">保存先ファイル名</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-[11px] sm:text-xs text-brand-400 bg-black border border-slate-800 px-3 py-2 overflow-x-auto whitespace-nowrap">
              public{variant.src}
            </code>
            <button
              onClick={() => copy('path', `public${variant.src}`)}
              className="shrink-0 p-2 border border-slate-700 text-slate-400 hover:border-brand-500 hover:text-brand-500 transition-colors"
              aria-label="ファイル名をコピー"
            >
              {copied === 'path' ? <Check className="w-4 h-4 text-brand-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* プロンプト本文 */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-black">
          <pre className="p-4 sm:p-6 font-mono text-[11px] sm:text-xs leading-relaxed text-slate-300 whitespace-pre-wrap break-words">
            {variant.prompt}
          </pre>
        </div>

        {/* フッター */}
        <div className="shrink-0 flex items-center gap-2 px-4 sm:px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <button
            onClick={() => copy('prompt', variant.prompt)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-500 text-black font-bold text-sm hover:bg-white transition-colors"
          >
            {copied === 'prompt' ? (
              <>
                <Check className="w-4 h-4" /> コピーしました
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> プロンプトをコピー
              </>
            )}
          </button>
          <button
            onClick={download}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-700 text-slate-300 text-sm hover:border-brand-500 hover:text-brand-500 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">.txt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Spec: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="px-3 sm:px-4 py-3">
    <p className="font-mono text-[9px] text-slate-600 tracking-widest">{label}</p>
    <p className="font-mono text-[11px] sm:text-xs text-white mt-0.5 truncate">{value}</p>
  </div>
);
