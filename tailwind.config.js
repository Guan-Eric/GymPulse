/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3490de",
        dark: {
          bg: "#181818",
          card: "#1f1f1f",
          border: "#2b2b2b",
        },
      },
    },
  },
  plugins: [],
};
