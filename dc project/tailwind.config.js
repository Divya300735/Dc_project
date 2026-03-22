/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0f172a',
          secondary: '#1e293b',
          accent: '#334155',
          border: '#475569',
          text: '#e2e8f0',
          muted: '#64748b'
        }
      }
    },
  },
  plugins: [],
}
