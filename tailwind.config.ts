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
        // Primary Green Palette (converted from CWFG blue)
        'forest': '#1B4D3E',      // Navy equivalent
        'green': {
          600: '#2D6A4F',         // Blue-600 equivalent (buttons, backgrounds)
          500: '#368859',         // Mid tone
          400: '#40916C',         // Blue-400 equivalent (primary CTA)
          300: '#52B788',         // Blue-300 equivalent
          250: '#74C69D',         // Blue-250 equivalent
          200: '#95D5B2',         // Light green
          100: '#B7E4C7',         // Very light
          50: '#D8F3DC',          // Lightest
        },
        // Neutral Colors (same as CWFG)
        'black': '#333438',
        'cream': '#fcfcfa',
        'cream-dark': '#f7f5f0',
        // Gray Scale
        'gray': {
          500: '#5e646e',
          400: '#878d96',
          300: '#b0b7c1',
          200: '#d8dee7',
        },
        // Accent
        'gold': '#D4A373',        // Warm gold accent
      },
      fontFamily: {
        // Playfair Display - elegant serif for wealth management
        'heading': ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        // DM Sans - clean modern sans-serif
        'body': ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // CWFG Typography Scale
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
        // CWFG Section padding
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
        'cwfg': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
      transitionDuration: {
        'cwfg': '250ms',
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
