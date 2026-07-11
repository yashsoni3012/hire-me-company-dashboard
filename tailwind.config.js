/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Global brand palette — Materio-style violet. Change these to re-theme the app.
        brand: {
          50:  '#F3EBFD',
          100: '#E4D3FB',
          200: '#C8A6F7',
          300: '#AC79F3',
          400: '#9159EF',
          500: '#8C57FF', // primary brand color (Materio violet)
          600: '#7C4DE4',
          700: '#6739C2',
          800: '#4F2B96',
          900: '#3A1F6E',
        },
        success: { 50: '#EAFBF1', 500: '#56CA00', 700: '#3D8F00' },
        info:    { 50: '#E8F6FE', 500: '#16B1FF', 700: '#0E7FBC' },
        warn:    { 50: '#FFF6E8', 500: '#FFB400', 700: '#B37E00' },
        danger:  { 50: '#FEEAEA', 500: '#FF4C51', 700: '#C73237' },
      },
      fontFamily: {
        sans: ['Public Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px 0 rgba(76, 78, 100, 0.08)',
      },
      borderRadius: {
        xl: '10px',
        '2xl': '14px',
      },
    },
  },
  plugins: [],
}
