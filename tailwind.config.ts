import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vital: {
          dark: '#0a0d0b',
          darker: '#07090a',
          card: '#131714',
          border: 'rgba(255,255,255,0.06)',
          'border-light': 'rgba(255,255,255,0.08)',
          text: '#f0f4f1',
          'text-secondary': 'rgba(240,244,241,0.55)',
          'text-muted': 'rgba(240,244,241,0.35)',
          green: '#10b981',
          'green-dark': '#047857',
          'green-deeper': '#064e3b',
          'green-light': '#34d399',
          gold: '#f4d03f',
          'gold-dark': '#d4af37',
          'gold-light': '#fde68a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f4d03f 0%, #d4af37 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0d0b 0%, #0c0f0d 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(16,185,129,0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(16,185,129,0.6)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
