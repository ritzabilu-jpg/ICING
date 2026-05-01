/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ice: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        navy: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Heebo', 'Arial', 'sans-serif'],
      },
      animation: {
        'float':          'float 6s ease-in-out infinite',
        'pulse-slow':     'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up':       'slide-up 0.4s ease-out',
        'fade-in-up':     'fade-in-up 0.7s ease-out both',
        'fade-in':        'fade-in 0.6s ease-out both',
        'ripple':         'ripple 3s ease-out infinite',
        'ripple-delay':   'ripple 3s ease-out 1s infinite',
        'ripple-delay2':  'ripple 3s ease-out 2s infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'shimmer':        'shimmer 2.5s linear infinite',
        'drift':          'drift 10s ease-in-out infinite',
        'snow':           'snow 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        'fade-in-up': {
          from: { transform: 'translateY(24px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        ripple: {
          '0%':   { transform: 'scale(0.6)', opacity: '0.5' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '33%':      { transform: 'translateY(-20px) translateX(10px) rotate(5deg)' },
          '66%':      { transform: 'translateY(-10px) translateX(-8px) rotate(-3deg)' },
        },
        snow: {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '10%':  { opacity: '0.7' },
          '90%':  { opacity: '0.4' },
          '100%': { transform: 'translateY(110vh)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
};
