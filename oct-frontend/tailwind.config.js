/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          accent: '#00d4aa',
          'accent-hover': '#00b894',
        },
        dark: {
          bg: '#0a0a0f',
          card: '#12121a',
          border: '#1e1e2e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
