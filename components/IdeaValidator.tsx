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
      {/* ★2026-11-16 明るい版（正本の絵 designs/lp-bright/sections/07-contact.png の相談の箱）。
          ★2026-11-17 依頼主「こういうのが全部AIっぽい」→ 端末の印・「AI_DIAGNOSTIC_SYSTEM v2.0」「ONLINE」、
          入力欄の「>_」と等幅の書体、「GEMINI_ENGINE」「0 CHARS」、ボタンの光が走る動きとグラデーション、
          答えの「OUTPUT_STREAM」「SUCCESS」を外した。入力欄には見える名札を付けた。 */}
      <form onSubmit={handleSubmit} aria-label="AI診断フォーム">
        <label htmlFor="idea-input" className="block mb-2 text-sm font-bold text-ink">
          知りたいこと・お悩み
        </label>
        <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-brand-400 transition-colors">
          <textarea
            id="idea-input"
            className="block w-full px-4 py-4 bg-transparent text-ink text-base sm:text-sm placeholder:text-slate-500 border-none outline-none resize-none focus:ring-0"
            rows={3}
            placeholder="あなたの目標やお悩みを入力..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            aria-describedby="feedback-area"
          />

          <div className="bg-white px-4 py-3 flex justify-end items-center">
            <button
              type="submit"
              disabled={loading || !idea.trim()}
              aria-label="AI診断を開始する"
              className="min-h-[44px] px-6 rounded-lg bg-brand-500 text-ink text-sm font-black hover:bg-brand-400 disabled:bg-slate-200 disabled:text-ink-mute disabled:cursor-not-allowed transition-colors"
            >
              <span className="flex items-center gap-2">
                {loading ? <GenIcon name="loader" className="w-5 h-5 animate-spin" /> : 'EXECUTE'}
              </span>
            </button>
          </div>
        </div>
      </form>

      {feedback && (
        <div id="feedback-area" className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden animate-fade-in-up" role="region" aria-label="AI診断結果">
          <p className="px-4 pt-4 text-sm font-bold text-ink">AIからの答え</p>
          <div className="p-4 pt-2">
            <div className="prose prose-sm max-w-none text-ink-soft prose-headings:text-brand-700 prose-p:text-ink-soft prose-strong:text-ink prose-ul:text-ink-soft prose-li:marker:text-brand-500">
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
