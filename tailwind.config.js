/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");
// const {herouiDark} = require("@heroui/react/dist/theme/dark");
// const {herouiLight} = require("@heroui/react/dist/theme/light");
// const {herouiDefault} = require("@heroui/react/dist/theme/default");

module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
}

