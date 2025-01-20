/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#0056d2",
        "custom-gray": "#333",
        "beige": "#FFDDAE",
        'persian-indigo': {
          '50': '#f5f3ff',
          '100': '#ece8ff',
          '200': '#dbd5ff',
          '300': '#c1b3ff',
          '400': '#a288fd',
          '500': '#8557fb',
          '600': '#7635f2',
          '700': '#6723de',
          '800': '#561dba',
          '900': '#481999',
          '950': '#33107b',
        },

      },
    }
  },
  plugins: [],
}

