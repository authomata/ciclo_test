/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      // Los colores se resuelven desde CSS variables que cambian por estación
      // y por tema (claro/oscuro). Ver src/index.css.
      colors: {
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        content: 'rgb(var(--content) / <alpha-value>)',
        'content-soft': 'rgb(var(--content-soft) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        season: 'rgb(var(--season) / <alpha-value>)',
        'season-soft': 'rgb(var(--season-soft) / <alpha-value>)',
        'season-ink': 'rgb(var(--season-ink) / <alpha-value>)',
        'on-season': 'rgb(var(--on-season) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
