/**
 * LP から外へ出る行き先。
 *
 * ★2026-11-17 依頼主の直し（fix-copy #15）：「無料で詳細を見る」「お問い合わせ」系は全部、
 *   LMS の資料請求ページへ送る（from=lp で LP から来たと分かるようにする）。
 *   前は LP の下の AI 診断の箱へ飛ばしていたが、そこは相談の受け口ではなかった。
 *   ★2026-11-17 時点で本番の LMS は /request をログイン画面へ転送する（公開ページは LMS の枝にあって未反映）。
 *   この LP を本番に出す前に、LMS 側の /request を本番に出しておくこと。
 */
export const REQUEST_URL = 'https://lms.techstars.studio/request?from=lp';
