/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
        },
        hindsight: {
          purple: '#8b5cf6',
          violet: '#7c3aed',
          cyan: '#06b6d4',
          emerald: '#10b981',
          dark: '#0f172a',
          card: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}
