/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pampa-black': '#1A1A1A',
        'pampa-white': '#F5F5F5',
        'pampa-beige': '#E6D5B8',
        'pampa-moss': '#4A5D4C',
        'pampa-leather': '#8B4513',
      },
      fontFamily: {
        'sans': ['Esqadero', 'sans-serif'],
        'serif': ['Esqadero', 'serif'],
      },
    },
  },
  plugins: [],
}