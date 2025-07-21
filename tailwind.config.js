/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Adjust if your files are elsewhere
  ],
  theme: {
    extend: {
      colors: {
        crimson: '#B31B1B',
        'warm-beige': '#D9C3A3',
        'dark-gray': '#3E3E3E',
        golden: '#C5A55B',
      },
    },
  },
  plugins: [],
};