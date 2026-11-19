/**
 * 「AIにその場で聞く」の問い合わせ先。
 *
 * ★2026-11-19 画面の JS から AI を直に呼ぶのをやめ、Netlify の関数（netlify/functions/ask-ai.mts）に聞く形にした。
 *   鍵を画面の JS に入れると誰でも読めるため、鍵はサーバー側（Netlify の環境変数 ANTHROPIC_API_KEY）にだけ置く。答えは Claude Haiku。
 *   画面が Google の AI の部品（@google/genai）を読まなくなったので、この区画の JS も軽くなった。
 */
const ENDPOINT = '/.netlify/functions/ask-ai';

export const validateBusinessIdea = async (question: string): Promise<string> => {
  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = (await r.json().catch(() => ({}))) as { answer?: string; error?: string };
    if (r.ok && data.answer) return data.answer;
    return data.error || '現在AIサービスが混み合っており、応答できませんでした。後ほど再度お試しください。';
  } catch {
    return '通信できませんでした。インターネットの接続を確かめて、もう一度お試しください。';
  }
};
