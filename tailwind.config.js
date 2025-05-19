/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",  // for older Next.js versions
    "./app/**/*.{js,ts,jsx,tsx}",    // for app directory support (Next.js 13+)
    "./components/**/*.{js,ts,jsx,tsx}", // include your components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} 