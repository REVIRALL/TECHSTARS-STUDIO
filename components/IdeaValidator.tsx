import React, { useState } from 'react';
import { validateBusinessIdea } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { GenIcon } from './GenIcon';

export const IdeaValidator: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setFeedback(null);
    
    try {
      const result = await validateBusinessIdea(idea);
      setFeedback(result);
    } catch (err) {
      setFeedback("システムエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Terminal Input Header */}
      {/* ★2026-11-16 明るい版（正本の絵 designs/lp-bright/sections/07-contact.png の相談の箱）。文言と動きは前のまま */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 text-brand-700">
        <GenIcon name="terminal" className="w-5 h-5" />
        <span className="text-[12px] font-mono font-bold tracking-normal sm:tracking-widest uppercase whitespace-nowrap">AI_DIAGNOSTIC_SYSTEM v2.0</span>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-[12px] font-mono font-bold text-green-700 whitespace-nowrap">ONLINE</span>
        </div>
      </div>

      {/* Cyberpunk Input Form */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-brand-400 transition-colors">
        <form onSubmit={handleSubmit} className="relative" aria-label="AI診断フォーム">
          {/* Input Area */}
          <div className="relative">
            <label htmlFor="idea-input" className="sr-only">あなたの目標やお悩みを入力してください</label>
            <div className="absolute top-4 left-4 font-mono font-bold text-brand-700 text-sm">&gt;_</div>
            <textarea
              id="idea-input"
              className="w-full pl-11 pr-4 py-4 bg-transparent text-ink font-mono text-base sm:text-sm placeholder:text-slate-500 border-none outline-none resize-none focus:ring-0"
              rows={3}
              placeholder="あなたの目標やお悩みを入力..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              aria-describedby="feedback-area"
            />
          </div>

          {/* Action Bar */}
          <div className="bg-white px-4 py-3 flex justify-between items-center gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-[12px] text-ink-mute font-mono whitespace-nowrap">GEMINI_ENGINE</span>
              <span className="text-[12px] text-ink-mute font-mono whitespace-nowrap">{idea.length} CHARS</span>
            </div>

            {/* Beam Button */}
            <button
              type="submit"
              disabled={loading || !idea.trim()}
              aria-label="AI診断を開始する"
              className="group relative overflow-hidden min-h-[44px] px-6 rounded-lg bg-gradient-to-b from-brand-400 to-brand-500 text-ink text-sm font-mono font-black tracking-widest uppercase disabled:from-slate-200 disabled:to-slate-200 disabled:text-ink-mute disabled:cursor-not-allowed transition-all hover:shadow-cta"
            >
              {/* Beam Effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center gap-2">
                {loading ? <GenIcon name="loader" className="w-5 h-5 animate-spin" /> : 'EXECUTE'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Area - Terminal Output Style */}
      {feedback && (
        <div id="feedback-area" className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden animate-fade-in-up" role="region" aria-label="AI診断結果">
          {/* Result Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#F4F8FB]">
            <span className="font-mono text-[12px] text-ink-mute">OUTPUT_STREAM</span>
            <span className="font-mono text-[12px] font-bold text-green-700">SUCCESS</span>
          </div>

          {/* Result Content */}
          <div className="p-4">
            <div className="prose prose-sm max-w-none text-ink-soft prose-headings:font-mono prose-headings:text-brand-700 prose-p:text-ink-soft prose-strong:text-ink prose-ul:text-ink-soft prose-li:marker:text-brand-500">
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};