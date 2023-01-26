const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        brand: colors.indigo,
        ...colors,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
