import React, { useState, useEffect, useRef } from 'react';
import { SectionId, PageType } from '../types';
import { GenIcon, GenIconName } from './GenIcon';
import { withImgVersion } from '../content/imgVersion';
import { getSlot, srcsetOf } from '../content/imageSlots';

/** メニューの写真＝最初の画面のスマホの写真の幅違い */
const HERO_SP = getSlot('hero.backdrop')!.mobile!.responsive!;

interface NavbarProps {
  onOpenPage: (page: PageType) => void;
}

/**
 * ヘッダー。
 * ★2026-11-16 明るい版。見た目の正本は designs/lp-stats/variants/2-section-fv/v2.png の上の帯
 *  （白い地に濃紺の字のメニュー・白い角丸のボタン「お申し込み」・水色の枠のボタン「受講生」）。
 *  ロゴは今の正規の物（/logo.png）をそのまま使う（ユーザー「ロゴは正規の今のやつ活用して。」）。
 *  メニューの項目の間に引いていた縦の区切り線は外した（飾りの線を引かない）。
 *  6項目＋ボタン2つが 1024px 未満では入り切らないので、PC のメニューは lg（1024px）から。
 *
 * ★2026-11-17 スマホのメニューを組み直した。依頼主「ハンバーガーメニューの画像も綺麗に生成」→ 5案 →
 *  「良い感じの案でいいよ」「それ含めてデプロイ」。案4「円の写真の上に」（LMS 側 designs/lp-menu/v4.png）を写した。
 *  - 三本線と閉じるは、白い紙の丸のボタンごと GPT に描かせた画像（menu-round・close-round）。後ろに淡い水色の円（CSS）。
 *  - 開くと、右に最初の画面の写真（講師と受講生）を大きな丸みの形に切り抜いて敷き、左から白い丸みの面を重ねて項目を置く。
 *    写真は最初の画面のスマホ用と同じ物（新しく描かない・読み込み済みの物を使う）。
 *  - 項目の前の印は紙の切り抜きの印。「よくある質問」の吹き出しだけ同じ画風で描き足した（message-circle）。
 *  - 案の絵の塗りのボタンはシアンの地に白い字だが、それだと 2.4:1 しか無いので、サイトのほかの塗りのボタンと同じ濃紺の字にした。
 *  - 飾りの線・番号・英字の札は置かない（案の絵にも無い）。
 */
type MobileItem =
  | { label: string; icon: GenIconName; href: string }
  | { label: string; icon: GenIconName; page: PageType };

const MOBILE_ITEMS: MobileItem[] = [
  { label: '学習の流れ', icon: 'arrow-right', href: `#${SectionId.Model}` },
  { label: 'カリキュラム', icon: 'file-text', href: `#${SectionId.Portfolio}` },
  // ★2026-11-19 ユーザー「料金プランは、ヘッダーのところ押したら前みたいにポップアップで出るようにして」
  //   → 区画へ飛ばさず、料金プランのポップアップを開く。同日「index.htmlには出ないように」で区画はページから外し、
  //     ページにあったカード・同意・お支払いの補足ごとポップアップ（FixedPageOverlay の Pricing）へ移した
  { label: '料金プラン', icon: 'bar-chart', page: PageType.Pricing },
  { label: '講師陣', icon: 'users', href: '#instructors' },
  { label: 'プログラム詳細', icon: 'laptop', page: PageType.Company },
  { label: 'よくある質問', icon: 'message-circle', page: PageType.FAQ },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // メニューの中身（写真・印）は一度開くまで作らない（最初の読み込みを重くしない）。閉じる時の動きのため、一度作ったら残す
  const [menuMounted, setMenuMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 開いている間は後ろの本文を動かさない。Esc で閉じる（閉じたら三本線のボタンへ戻す）。PC の幅になったら閉じる
  useEffect(() => {
    if (!isMenuOpen) return;
    const html = document.documentElement;
    const prevBody = document.body.style.overflow;
    const prevHtml = html.style.overflow;
    document.body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = () => {
      if (wide.matches) setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      document.body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setMenuMounted(true);
    setIsMenuOpen((v) => !v);
  };
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    // ★2026-11-17 学習の流れの区画は見出しと進め方の4段だけになったので、区画の頭（#model）へ飛ばす
    { label: '学習の流れ', href: `#${SectionId.Model}` },
    { label: 'カリキュラム', href: `#${SectionId.Portfolio}` },
    { label: '料金プラン', page: PageType.Pricing },
    { label: '講師陣', href: '#instructors' },
  ] as ({ label: string; href: string } | { label: string; page: PageType })[];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-[background-color,box-shadow,padding] duration-300 ${
          isMenuOpen
            ? 'bg-transparent shadow-none py-2 lg:py-6'
            : isScrolled
              ? 'bg-white shadow-[0_6px_24px_-12px_rgba(11,27,46,0.18)] py-2 lg:py-2.5'
              : 'bg-transparent py-4 lg:py-6'
        }`}
        aria-label="メインナビゲーション"
      >
        <div className="max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-12 flex justify-between items-center gap-4">
          {/* Logo */}
          {/* ★2026-11-17 行き先を「#」から最初の画面（#home）に（押す検査で「行き先が無い」と出た） */}
          <a href="#home" onClick={closeMenu} className="flex items-center gap-2 md:gap-3 group z-50 shrink-0 min-h-[44px]">
            {/* ★2026-11-19 読み込みを軽く：/logo.png（698×626・60KB）を描く高さ（40〜48px）×3 倍の細かさまでに縮めた写し（16KB）。
                縦横比は同じ（241×216）なので見た目は変わらない。/logo.png はファビコン・共有の絵に残す */}
            <img
              src={withImgVersion('/img/logo-216.webp')}
              alt="TechStars"
              width={241}
              height={216}
              className="h-10 lg:h-12 w-auto group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <span className="font-black text-ink text-[15px] sm:text-lg lg:text-[22px] tracking-tight">TECHSTARS</span>
              {/* ★2026-11-17 スマホ・タブレットは最初の画面の写真に直に乗る（白いかすみを外した）ので、1段濃い青（写真の明るい所で 4.5:1 以上）。PC は今のまま */}
              <span className="font-black text-brand-800 lg:text-brand-700 text-[15px] sm:text-lg lg:text-[22px] tracking-tight">AI</span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <div className="flex items-center">
              {navLinks.map((link) =>
                'href' in link ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-2.5 xl:px-4 py-3 text-sm xl:text-[15px] font-bold text-ink hover:text-brand-700 transition-colors whitespace-nowrap"
                  >
                    {link.label}
                  </a>
                ) : (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => onOpenPage(link.page)}
                    className="px-2.5 xl:px-4 py-3 text-sm xl:text-[15px] font-bold text-ink hover:text-brand-700 transition-colors whitespace-nowrap"
                  >
                    {link.label}
                  </button>
                ),
              )}
              <button
                onClick={() => onOpenPage(PageType.Company)}
                className="px-2.5 xl:px-4 py-3 text-sm xl:text-[15px] font-bold text-ink hover:text-brand-700 transition-colors whitespace-nowrap"
              >
                詳細
              </button>
              <button
                onClick={() => onOpenPage(PageType.FAQ)}
                className="px-2.5 xl:px-4 py-3 text-sm xl:text-[15px] font-bold text-ink hover:text-brand-700 transition-colors whitespace-nowrap"
              >
                FAQ
              </button>
            </div>

            {/* ★2026-11-19 料金プランの区画はページに無いので、料金プランのポップアップを開く */}
            <button
              type="button"
              onClick={() => onOpenPage(PageType.Pricing)}
              className="ml-2 inline-flex items-center justify-center min-h-[48px] px-6 xl:px-8 rounded-xl bg-white text-ink font-black text-sm xl:text-base shadow-card hover:shadow-lift hover:text-brand-700 transition-[box-shadow,color] duration-300 whitespace-nowrap"
            >
              お申し込み
            </button>
            <a
              href="https://lms.techstars.studio/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[48px] px-6 xl:px-9 rounded-xl border-2 border-brand-500 bg-white/70 text-brand-700 font-black text-sm xl:text-base hover:bg-brand-500 hover:text-ink transition-colors duration-300 whitespace-nowrap"
            >
              受講生
            </a>
          </div>

          {/* スマホの開閉ボタン。白い紙の丸のボタン（画像）と、後ろの淡い水色の円。押せる所は 52px */}
          <button
            ref={toggleRef}
            type="button"
            className={`m-toggle lg:hidden relative z-50 -mr-1 grid place-items-center w-[52px] h-[52px] rounded-full ${isMenuOpen ? 'is-open' : ''}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span aria-hidden="true" className="m-toggle-halo" />
            <GenIcon name="menu-round" className="m-toggle-img m-toggle-menu w-[46px] h-[46px]" eager />
            <GenIcon name="close-round" className="m-toggle-img m-toggle-close w-[46px] h-[46px]" eager />
          </button>
        </div>
      </nav>

      {/* スマホのメニュー（案4「円の写真の上に」）。閉じている間は見えない・押せない・読み上げない（visibility と inert） */}
      <div
        id="mobile-menu"
        className={`m-menu lg:hidden ${isMenuOpen ? 'is-open' : ''}`}
        inert={!isMenuOpen}
      >
        {menuMounted && (
          <>
            {/* 右の写真：最初の画面の写真（講師と受講生）を大きな丸みの形に切り抜く */}
            <div aria-hidden="true" className="m-menu-photo">
              {/* ★2026-11-19 写真を 4K の幅違いにした（content/imageSlots.ts の hero.backdrop）。メニューの写真は画面の高さの約 52%
                  （枠の高さ 84% に 9:16 で合わせて ×1.1）に描くので、その幅に合う1枚を選ばせる */}
              <picture>
                <source type="image/avif" srcSet={srcsetOf(HERO_SP, 'avif', withImgVersion)} sizes="52vh" />
                <img
                  src={withImgVersion(HERO_SP.base + '-1080w.webp')}
                  srcSet={srcsetOf(HERO_SP, 'webp', withImgVersion)}
                  sizes="52vh"
                  alt=""
                  width={2160}
                  height={3840}
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover select-none"
                />
              </picture>
            </div>
            {/* 地の淡い水色の円（案の絵の位置） */}
            <span aria-hidden="true" className="dot m-menu-dot w-[30px] h-[30px] right-[22%] top-[26%] z-[2]" />
            <span aria-hidden="true" className="dot m-menu-dot w-[92px] h-[92px] -right-[26px] bottom-[9%] z-[2]" />
            <span aria-hidden="true" className="dot m-menu-dot w-[64px] h-[64px] right-[16%] bottom-[2%] z-[2]" />
            <span aria-hidden="true" className="dot m-menu-dot w-4 h-4 right-[34%] bottom-[13%] z-[2]" />
            {/* 左の白い丸みの面 */}
            <div aria-hidden="true" className="m-menu-sheet" />

            <div className="m-menu-body">
              <ul className="flex flex-col">
                {MOBILE_ITEMS.map((item, i) => (
                  <li key={item.label} className="m-menu-item" style={{ '--i': i } as React.CSSProperties}>
                    {'href' in item ? (
                      <a href={item.href} onClick={closeMenu} className="m-menu-link">
                        <GenIcon name={item.icon} className="m-menu-icon" eager />
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          closeMenu();
                          onOpenPage(item.page);
                        }}
                        className="m-menu-link"
                      >
                        <GenIcon name={item.icon} className="m-menu-icon" eager />
                        <span>{item.label}</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <div className="m-menu-item m-menu-cta" style={{ '--i': MOBILE_ITEMS.length } as React.CSSProperties}>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onOpenPage(PageType.Pricing);
                  }}
                  className="inline-flex w-full items-center justify-center min-h-[54px] px-6 rounded-full bg-brand-500 text-ink font-black text-[17px] shadow-cta hover:bg-brand-400 transition-colors"
                >
                  お申し込み
                </button>
                <a
                  href="https://lms.techstars.studio/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="inline-flex w-full items-center justify-center min-h-[54px] px-6 rounded-full border-2 border-brand-500 bg-white text-brand-700 font-black text-[17px] hover:bg-brand-50 transition-colors"
                >
                  受講生専用ページ
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
