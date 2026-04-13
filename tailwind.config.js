/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pearl: '#FBF8F4',
          linen: '#EAE1D7',
          fendi: '#C2AE98',
          mocha: '#7A6051',
          espresso: '#2F2622',
          burgundy: '#6E2F3A',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
