/** Tailwind の設定。
 *  もとは index.html のインライン <script> に書かれ、cdn.tailwindcss.com が実行時に読んでいた。
 *  CDN はバージョン無指定・SRI 無しで、決済リンクを描くページで DOM 全権を持つため撤去し、
 *  ビルド時に CSS を生成する方式へ移した。値は移設時点の本番 index.html と一致させてある。
 *  @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './types.ts',
    './components/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans JP"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Noto Sans JP"', 'monospace'],
      },
      colors: {
        // ★2026-11-16 明るい版。ユーザー「２で。他の全セクションも明るい系に。」
        //   正本の絵（designs/lp-stats/variants/2-section-fv/v2.png）の明るいシアンを塗り（500）に、
        //   白い地で字に使う色は 700（#0675AD・白地で 5.0:1）にする。500 を字に使わない（白地で 2.4:1 しか無い）。
        brand: {
          50: '#F0F9FD',
          100: '#DFF2FA',
          200: '#BFE6F6',
          300: '#8DD6F2',
          400: '#3FC8F2',
          500: '#14B4EA', // 塗り・印（ボタンの地・チェックの丸）
          600: '#0B8FC6',
          700: '#0675AD', // 白い地の上の字（5.0:1）
          800: '#075A85',
          900: '#0B3F5C',
        },
        // 見出しと本文の濃紺（正本の「7日間で」の色）
        ink: {
          DEFAULT: '#0B1B2E',
          soft: '#334155',
          mute: '#475569',
        },
        // 区画の淡い地（白の次の段）
        mist: '#F1F8FC',
      },
      boxShadow: {
        // 正本の白いカード・ボタンの影（淡く広い）
        card: '0 10px 30px -12px rgba(11, 27, 46, 0.18), 0 2px 6px -2px rgba(11, 27, 46, 0.06)',
        lift: '0 18px 40px -16px rgba(11, 27, 46, 0.24), 0 4px 10px -4px rgba(11, 27, 46, 0.08)',
        cta: '0 12px 28px -10px rgba(20, 180, 234, 0.55)',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        // SURGE animations - バチバチ、電気的
        'hero-title': 'surgeTitleSlide 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'hero-badge': 'surgeFlash 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards',
        'hero-desc': 'surgeSlideIn 1s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards',
        'hero-cards': 'surgeRise 1s cubic-bezier(0.22, 1, 0.36, 1) 0.8s forwards',
        // Glitch line effect
        'surge-line': 'surgeLine 0.6s ease-out forwards',
        'reveal': 'reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-up': 'revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-left': 'revealLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-right': 'revealRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-scale': 'revealScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'card-hover': 'cardHover 0.3s ease-out forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // SURGE Hero animations - バチバチ電気的
        surgeTitleSlide: {
          '0%': { transform: 'translateY(80px) skewY(4deg)', opacity: '0', filter: 'blur(8px)' },
          '40%': { transform: 'translateY(-8px) skewY(-1deg)', opacity: '1', filter: 'blur(0)' },
          '60%': { transform: 'translateY(4px) skewY(0.5deg)' },
          '100%': { transform: 'translateY(0) skewY(0)', opacity: '1' },
        },
        surgeFlash: {
          '0%': { transform: 'scale(0.5) rotate(-10deg)', opacity: '0' },
          '50%': { transform: 'scale(1.15) rotate(2deg)', opacity: '1' },
          '70%': { transform: 'scale(0.95) rotate(-1deg)' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
        surgeSlideIn: {
          '0%': { transform: 'translateX(-60px)', opacity: '0', filter: 'blur(4px)' },
          '50%': { transform: 'translateX(8px)', opacity: '1', filter: 'blur(0)' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        surgeRise: {
          '0%': { transform: 'translateY(60px) scale(0.95)', opacity: '0' },
          '60%': { transform: 'translateY(-5px) scale(1.02)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        surgeLine: {
          '0%': { width: '0%', opacity: '1' },
          '100%': { width: '100%', opacity: '1' },
        },
        // Scroll reveal animations
        reveal: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        revealUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        revealLeft: {
          '0%': { transform: 'translateX(-50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        revealRight: {
          '0%': { transform: 'translateX(50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        revealScale: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        cardHover: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-8px)' },
        }
      }
    }
  }
}
