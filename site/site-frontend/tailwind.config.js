/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables class-based dark mode
  theme: {
    extend: {
      boxShadow: {
        'solid-black': '1rem 1rem 4px 1px #000000A0', // Creates a solid black shadow
      },
      colors: {
        // Gradient Colors
        gradientStart: {
          light: '#ffca00', // Light mode start color
          dark: '#0F2027',  // Dark mode start color
        },
        gradientMid: {
          light: '#203A43', // Light mode mid color
          dark: '#203A43',  // Same for both modes
        },
        gradientEnd: {
          light: '#0F2027', // Light mode end color
          dark: '#2C5364',  // Dark mode end color
        },
        // Primary and Secondary Colors
        primary: '#FA8072',
        secondary: {
          100: '#008ACAFF', // Light gray
          200: '#009790FF', // Medium gray
        },
        // Neutral Background Colors
        background: {
          light: '#f7f2ea',  // Light mode background
          dark: '#1F2937',   // Dark mode background
        },
        // Neutral Text Colors
        text: {
          light: '#111827',  // Light mode text
          dark: '#F3F4F6',   // Dark mode text
        },
      },
      fontFamily: {
        sans: ['Poppiun', 'Arial', 'sans-serif'], // Sans-serif fonts
      },
      animation: {
        gradientBG: 'gradientBG 8s ease infinite', // Gradient animation
      },
      keyframes: {
        gradientBG: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [
  ],
}
