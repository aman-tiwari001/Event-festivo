/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6559f1',
        secondary: '#d7d4fc',
        accent: '#7065F0',
        dark: '#7065F0',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

