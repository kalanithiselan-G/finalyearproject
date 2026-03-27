// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        waveUpDown: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-30%)" },
        },
        lineUpDown: {
          "0%": { transform: "translateY(-15%)" },
          "50%": { transform: "translateY(15%)" },
          "100%": { transform: "translateY(-15%)" },
        },
      },
      animation: {
        waveUpDown: "waveUpDown 0.8s ease-in-out infinite",
        lineUpDown: "lineUpDown 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
