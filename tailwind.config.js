/** @type {import('tailwindcss').Config} */
// ============================================================================
// これまで index.html の <script>tailwind.config = {...}</script> に書いていた設定。
// CDN版 Tailwind はブラウザ上でCSSを生成するため、
//   - 約120KBのJSがレンダリングをブロックする
//   - CSSが当たるまで素のHTMLが一瞬見える（FOUC）
//   - 公式に本番非推奨
// という三重苦だった。ビルド時に必要な分だけCSSへ焼くのが正しい。
// ============================================================================
export default {
  content: ['./index.html', './index.tsx', './App.tsx', './entry-server.tsx', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans JP"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Noto Sans JP"', 'monospace'],
      },
      colors: {
        // 全段を同じ色相(≈187°)で揃えたシアンのランプ。
        // 以前は 50〜400 が teal(緑) で 500 だけシアンだったため、
        // ホバー色 brand-400 に触れた瞬間に色がミント緑へ転んでいた。
        brand: {
          50: '#ECFEFF',
          100: '#CBF8FF',
          200: '#9DF1FF',
          300: '#6BE8FF',
          400: '#33DFFF', // hover 用。500 と同色相のまま明るいだけ
          500: '#00E5FF', // High Voltage Cyan
          600: '#00B8D4',
          700: '#0F8CA6',
          800: '#12657A',
          900: '#12495A',
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        // SURGE animations - バチバチ、電気的
        'hero-title': 'surgeTitleSlide 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'hero-badge': 'surgeFlash 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards',
        'hero-desc': 'surgeSlideIn 1s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards',
        'hero-cards': 'surgeRise 1s cubic-bezier(0.22, 1, 0.36, 1) 0.8s forwards',
        'surge-line': 'surgeLine 0.6s ease-out forwards',
        reveal: 'reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
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
        },
      },
    },
  },
  plugins: [],
};
