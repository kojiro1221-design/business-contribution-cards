import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf4e7',
          100: '#fae5c3',
          200: '#f5c97e',
          300: '#f0ad39',
          400: '#e8920a',
          500: '#c97a08',
          600: '#a86306',
          700: '#874e05',
          800: '#663b04',
          900: '#4a2b03',
        },
      },
    },
  },
  plugins: [],
}
export default config
