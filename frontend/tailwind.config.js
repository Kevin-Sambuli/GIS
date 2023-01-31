/** @type {import('tailwindcss').Config} */
module.exports = {
    // mode: "jit",
  content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
        colors: {
        "dark-purple": "#081A51",
        "light-white": "rgba(255,255,255,0.17)",
      },
    },
    container:{
        center:true,
    },
  },
  plugins: [require('flowbite/plugin')],
};
