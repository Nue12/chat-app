/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      color: {
        "line-input": "#E6E6E6",
      },
      boxShadow: {
        "swipe-shadow": "-129px -5px 56px 144px rgba(0,0,0,0.64)",
      },
      screens: {
        xs: "480px",
        "ph-L": "425px",
      },
      keyframes: {
        fC: {
          "0%": { backgroundColor: "#D9D9D9" },
          "20%": { backgroundColor: "#A6A6A6" },
          "40%": { backgroundColor: "#D9D9D9" },
        },
        sC: {
          "20%": { backgroundColor: "#D9D9D9" },
          "40%": { backgroundColor: "#A6A6A6" },
          "60%": { backgroundColor: "#D9D9D9" },
        },
        tC: {
          "40%": { backgroundColor: "#D9D9D9" },
          "60%": { backgroundColor: "#A6A6A6" },
          "90%": { backgroundColor: "#D9D9D9" },
        },
      },
      animation: {
        fC: "fC 1.5s ease-in-out infinite",
        sC: "fC 1.5s ease-in-out infinite",
        tC: "fC 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
