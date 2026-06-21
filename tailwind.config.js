/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic financial colors stay constant across themes — their meaning
        // (good/bad/caution) must not change when the user switches light/dark.
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
        // Everything else is theme-aware via CSS variables (see index.css for the
        // light `:root` and dark `.dark` values), so existing classNames like
        // `bg-card` or `text-ink` automatically follow the active theme.
        card: {
          DEFAULT: 'rgb(var(--color-card) / <alpha-value>)',
          alt: 'rgb(var(--color-card-alt) / <alpha-value>)',
        },
        deep: {
          DEFAULT: 'rgb(var(--color-deep) / <alpha-value>)',
          darker: 'rgb(var(--color-deep-darker) / <alpha-value>)',
          violet: 'rgb(var(--color-deep-violet) / <alpha-value>)',
          magenta: 'rgb(var(--color-deep-magenta) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          light: 'rgb(var(--color-accent-light) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-dark) / <alpha-value>)',
          soft: 'rgb(var(--color-accent-soft) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          soft: 'rgb(var(--color-ink-soft) / <alpha-value>)',
        },
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        track: 'rgb(var(--color-track) / <alpha-value>)',
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
