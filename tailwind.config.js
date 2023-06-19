/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fontColor: '#717171', // Custom color with the name 'primary' and hex code '#ff0000'
        secondary: '#00ff00', // Custom color with the name 'secondary' and hex code '#00ff00'
      },
    },
  },
  plugins: [],
}

