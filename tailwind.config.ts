import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Navy Palette (Swiss/Premium style)
        'navy': '#0d1b2a',           // Primary dark navy
        'forest': '#0d1b2a',         // Alias for backwards compatibility
        'navy-light': '#1b263b',     // Slightly lighter
        'navy-50': '#f0f4f8',
        'navy-100': '#d9e2ec',
        'navy-200': '#bcccdc',
        'navy-300': '#9fb3c8',
        'navy-400': '#829ab1',
        'navy-500': '#627d98',
        'navy-600': '#486581',
        'navy-700': '#334e68',
        'navy-800': '#243b53',
        'navy-900': '#102a43',
        // Green for success states
        'green': {
          600: '#16a34a',
          500: '#22c55e',
          400: '#4ade80',
          300: '#86efac',
          200: '#bbf7d0',
          100: '#dcfce7',
          50: '#f0fdf4',
        },
        // Neutral Colors
        'black': '#1a1a2e',
        'cream': '#fafafa',
        'cream-dark': '#f5f5f5',
        // Gray Scale
        'gray': {
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
        },
        // Accent - Gold (warm, premium)
        'gold': '#C9A227',
        'gold-light': '#D4A373',
      },
      fontFamily: {
        // Playfair Display - elegant serif for wealth management
        'heading': ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        // DM Sans - clean modern sans-serif
        'body': ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography Scale
        'h1': ['89.07px', { lineHeight: '1.1', fontWeight: '400' }],
        'h1-md': ['60px', { lineHeight: '1.1', fontWeight: '400' }],
        'h1-sm': ['48px', { lineHeight: '1.1', fontWeight: '400' }],
        'h1-xs': ['36px', { lineHeight: '1.15', fontWeight: '400' }],
        'h2-label': ['11.13px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0.45px' }],
        'h3': ['44.54px', { lineHeight: '1.2', fontWeight: '400' }],
        'h3-sm': ['25.98px', { lineHeight: '1.15', fontWeight: '400', letterSpacing: '-0.26px' }],
        'h4': ['29.69px', { lineHeight: '1.1', fontWeight: '600', letterSpacing: '-0.15px' }],
        'h4-lg': ['37.11px', { lineHeight: '1.15', fontWeight: '500' }],
        'body-lg': ['22.27px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['14.85px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['16.70px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['11.13px', { lineHeight: '1.25', fontWeight: '300' }],
      },
      spacing: {
        // Section padding
        'section-lg': '148.45px',
        'section-md': '118.76px',
        'section-sm': '74.23px',
        'navbar': '76.19px',
      },
      borderRadius: {
        'button': '100px',
        'button-sm': '50px',
        'card': '8px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
      transitionDuration: {
        'smooth': '250ms',
      },
      animation: {
        'ken-burns': 'kenburns 10s ease-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.2)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
