import React, { useEffect, useMemo, useState } from 'react';
import { X, Copy, Check, Download, Sparkles, CircleCheck, CircleDashed } from 'lucide-react';
import { IMAGE_SLOTS, slotsBySection, ImageSlot, Device } from '../content/imageSlots';
import { PromptModal, useCopy } from './PromptModal';

/**
 * PromptConsole — 画像生成の作業台（開発・運用向け）
 *
 * URL に `?prompts=1` を付けるか、`Ctrl/Cmd + Shift + I` で開く。
 * サイト内の全画像枠を一覧し、プロンプトの個別コピー／全件まとめコピー／JSON書き出しができる。
 * 「どれがまだ未生成か」もここで一望できる。
 */

interface Status {
  id: string;
  device: Device;
  ready: boolean;
}

export const PromptConsole: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<ImageSlot | null>(null);
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});
  const [copied, copy] = useCopy();

  // 起動条件: ?prompts=1 / #prompts / Ctrl(Cmd)+Shift+I
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('prompts') === '1' || window.location.hash === '#prompts') setOpen(true);

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 開いたときに全画像の存在チェック
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const checks: Promise<Status>[] = [];
    for (const s of IMAGE_SLOTS) {
      const variants: [Device, string][] = [['desktop', s.desktop.src]];
      if (s.mobile) variants.push(['mobile', s.mobile.src]);
      for (const [device, src] of variants) {
        checks.push(
          new Promise<Status>((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ id: s.id, device, ready: true });
            img.onerror = () => resolve({ id: s.id, device, ready: false });
            img.src = src;
          })
        );
      }
    }
    Promise.all(checks).then((results) => {
      if (cancelled) return;
      const next: Record<string, boolean> = {};
      for (const r of results) next[`${r.id}:${r.device}`] = r.ready;
      setStatuses(next);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const sections = useMemo(() => slotsBySection(), []);

  const totals = useMemo(() => {
    let total = 0;
    let done = 0;
    for (const s of IMAGE_SLOTS) {
      total += s.mobile ? 2 : 1;
      if (statuses[`${s.id}:desktop`]) done++;
      if (s.mobile && statuses[`${s.id}:mobile`]) done++;
    }
    return { total, done };
  }, [statuses]);

  const allPromptsText = useMemo(() => {
    const blocks: string[] = [
      '================================================================',
      'TechStars — 画像生成プロンプト一式',
      `全 ${IMAGE_SLOTS.reduce((n, s) => n + (s.mobile ? 2 : 1), 0)} カット`,
      '各ブロックを1枚ずつ画像生成AIに投げてください。',
      '生成した画像は各ブロックの「保存先」に書かれたパスに置けば自動で反映されます。',
      '================================================================',
      '',
    ];
    for (const s of IMAGE_SLOTS) {
      const variants: [Device, typeof s.desktop][] = [['desktop', s.desktop]];
      if (s.mobile) variants.push(['mobile', s.mobile]);
      for (const [device, v] of variants) {
        blocks.push(
          `\n\n----------------------------------------------------------------`,
          `[${s.id} / ${device}] ${s.label}`,
          `保存先: public${v.src}`,
          `用途: ${s.role}`,
          `----------------------------------------------------------------\n`,
          v.prompt
        );
      }
    }
    return blocks.join('\n');
  }, []);

  const downloadJson = () => {
    const data = IMAGE_SLOTS.map((s) => ({
      id: s.id,
      label: s.label,
      section: s.section,
      role: s.role,
      alt: s.alt,
      desktop: { path: `public${s.desktop.src}`, size: [s.desktop.width, s.desktop.height], aspect: s.desktop.aspect, prompt: s.desktop.prompt },
      mobile: s.mobile
        ? { path: `public${s.mobile.src}`, size: [s.mobile.width, s.mobile.height], aspect: s.mobile.aspect, prompt: s.mobile.prompt }
        : null,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'techstars-image-prompts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[190] bg-black/95 backdrop-blur-sm overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ヘッダー */}
        <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <p className="font-mono text-[10px] text-brand-500 tracking-widest mb-2">// IMAGE_PROMPT_CONSOLE</p>
            <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter text-white">
              画像生成プロンプト一覧
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              ここのプロンプトで画像を作り、書かれたパスに置くだけで自動的にサイトへ反映されます。
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="shrink-0 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="閉じる"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 進捗 */}
        <div className="mb-8 p-4 sm:p-6 border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-slate-400">GENERATED</span>
            <span className="font-mono text-sm text-brand-500 font-bold">
              {totals.done} / {totals.total} カット
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-[width] duration-700"
              style={{ width: `${totals.total ? (totals.done / totals.total) * 100 : 0}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => copy('all', allPromptsText)}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-black font-bold text-xs hover:bg-white transition-colors"
            >
              {copied === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied === 'all' ? 'コピーしました' : '全プロンプトをまとめてコピー'}
            </button>
            <button
              onClick={downloadJson}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-700 text-slate-300 text-xs hover:border-brand-500 hover:text-brand-500 transition-colors"
            >
              <Download className="w-4 h-4" /> JSONで書き出す
            </button>
          </div>
        </div>

        {/* 一覧 */}
        {sections.map(({ section, slots }) => (
          <div key={section} className="mb-10">
            <h3 className="font-mono text-xs text-brand-500 tracking-widest mb-4 pb-2 border-b border-slate-800">
              {section}
            </h3>
            <div className="space-y-2">
              {slots.map((s) => {
                const dReady = statuses[`${s.id}:desktop`];
                const mReady = s.mobile ? statuses[`${s.id}:mobile`] : true;
                const ready = dReady && mReady;
                return (
                  <button
                    key={s.id}
                    onClick={() => setDetail(s)}
                    className="w-full text-left group flex items-start gap-4 p-4 bg-black border border-slate-800 hover:border-brand-500/60 transition-colors"
                  >
                    <span className="shrink-0 mt-0.5">
                      {ready ? (
                        <CircleCheck className="w-5 h-5 text-brand-500" />
                      ) : (
                        <CircleDashed className="w-5 h-5 text-slate-600" />
                      )}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-mono text-[10px] text-brand-500 tracking-widest">{s.id}</span>
                        <span className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                          {s.label}
                        </span>
                        <span className="font-mono text-[10px] text-slate-600">
                          {s.desktop.aspect}
                          {s.mobile ? ` + ${s.mobile.aspect}(SP)` : ' / SP共用'}
                        </span>
                      </span>
                      <span className="block text-xs text-slate-500 mt-1.5 leading-relaxed">{s.role}</span>
                    </span>
                    <Sparkles className="shrink-0 w-4 h-4 text-slate-700 group-hover:text-brand-500 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <p className="font-mono text-[10px] text-slate-600 text-center pb-8">
          このコンソールは <span className="text-slate-400">?prompts=1</span> または{' '}
          <span className="text-slate-400">Ctrl/Cmd + Shift + I</span> で開閉できます
        </p>
      </div>

      {detail && <PromptModal slot={detail} onClose={() => setDetail(null)} />}
    </div>
  );
};
