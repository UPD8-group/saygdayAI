/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0B6E78',
          light: '#0d8a96',
          dark: '#085860',
        },
        cream: '#FFF8EE',
        charcoal: '#1A1A1A',
        sunset: '#F6A86B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
