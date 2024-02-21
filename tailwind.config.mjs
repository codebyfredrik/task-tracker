/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink1: 'oklch(65.59% 0.298 354.31 / <alpha-value>)',
        indigo1: 'oklch(50% 0.303 277.37 / <alpha-value>)'
      },
      boxShadow: {
        xl: '0 20px 25px -5px oklch(0 0 0 / 0.1), 0 10px 10px -5px oklch(0 0 0 / 0.06)'
      }
    }
  },
  plugins: []
}
