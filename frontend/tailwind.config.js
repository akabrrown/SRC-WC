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
          navy: "#00004E",
          navyDark: "#00002E",
          navyLight: "#0A0A66",
          gold: "#C69500",
          goldHover: "#A87E00",
          goldLight: "#F5E9C9",
        },
        ink: "#1A1A1A",
        surface: "#FFFFFF",
        muted: "#F4F1EA",
        border: "#E5E5E0",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
      }
    },
  },
  plugins: [],
}
