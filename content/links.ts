/**
 * LP から外へ出る行き先。
 *
 * ★2026-11-17 依頼主の直し（fix-copy #15）：「無料で詳細を見る」「お問い合わせ」系は全部、
 *   LMS の資料請求ページへ送る（from=lp で LP から来たと分かるようにする）。
 *   前は LP の下の AI 診断の箱へ飛ばしていたが、そこは相談の受け口ではなかった。
 *
 * ★2026-11-17 一時的にメールにした。
 *   本番の LMS にはまだ資料請求のページ（/request）が無く、開くとログイン画面へ飛ぶ。LP を先に本番に出すので、
 *   それまでの間、相談の行き先は support@techstars.studio へのメール（件名つき）にする。
 *   使っている所（最初の画面「無料で詳細を見る」・呼びかけ「無料で資料請求・相談する」・
 *   決済の後の「相談してから決めたい」・料金の「お問い合わせは…」の一文）は全部この REQUEST_URL を見ている。
 *
 *   ▼LMS の資料請求が本番に出たら：下の REQUEST_URL を LMS_REQUEST_URL に戻すだけでよい
 *     （export const REQUEST_URL = LMS_REQUEST_URL;）。料金の一文も REQUEST_BY_MAIL を見て
 *     「資料請求のページからどうぞ」の文に自動で戻る。ほかに直す所は無い。
 */
export const LMS_REQUEST_URL = 'https://lms.techstars.studio/request?from=lp';

export const SUPPORT_EMAIL = 'support@techstars.studio';

/** 一時的な行き先：support@techstars.studio へのメール（件名「TechStars 資料請求・ご相談」） */
export const REQUEST_MAIL_URL = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('TechStars 資料請求・ご相談')}`;

/** 相談の行き先。★2026-11-17 LMS の資料請求（/request）が本番に出たので LMS_REQUEST_URL に戻した。
 *  LMS が止まった時は REQUEST_MAIL_URL に替えるだけでメールに戻る */
export const REQUEST_URL: string = LMS_REQUEST_URL;

/** 行き先がメールの間は true（料金の一文をメールの文にする） */
export const REQUEST_BY_MAIL = REQUEST_URL.startsWith('mailto:');
