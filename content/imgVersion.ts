/**
 * public/img/ の画像の URL に付ける版の印。
 *
 * ★なぜ要るか（2026-11-19）
 *   public/img/ の画像は名前が固定で、netlify.toml の /img/* は「1日使い回し＋その後も古い物を先に見せて裏で取り直す」。
 *   11/16 に最初の画面の写真を明るい2人の写真へ差し替えたとき名前を変えなかったので、前に見たことのある PC には
 *   前の暗い写真が出続けた（ユーザー「ヒーローセクションの画像が、前の暗めのやつになってる。PC」。
 *   何も覚えていないブラウザで本番を開くと明るい写真＝配っている物は正しく、ブラウザが覚えた古い物が出ていた）。
 * ★public/img/ の画像を差し替えたら、この日付を上げる。全部の画像の URL が変わり、どの端末も取り直す。
 *   ファイル名そのものは変えない（scripts/optimize-images.mjs が content/imageSlots.ts の src の名前で照らす）。
 */
export const IMG_VERSION = '20261119';

/** /img/… の URL に版の印を付ける */
export const withImgVersion = (src: string): string => `${src}${src.includes('?') ? '&' : '?'}v=${IMG_VERSION}`;
