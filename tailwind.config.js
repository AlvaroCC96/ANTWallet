/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wealth: {
          DEFAULT: '#22c55e',
          dark: '#15803d',
        },
        danger: {
          DEFAULT: '#ef4444',
          dark: '#991b1b',
        },
        warning: {
          DEFAULT: '#f97316',
        },
        card: {
          DEFAULT: '#141a23',
          alt: '#1c2430',
        },
        deep: {
          DEFAULT: '#0b0e14',
          darker: '#2a3340',
          violet: '#6d28d9',
          magenta: '#a21caf',
        },
        accent: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#3730a3',
          soft: '#4338ca',
        },
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}
