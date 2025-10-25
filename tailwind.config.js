/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ocean-blue': '#0077be',
        'deep-blue': '#003f5c',
        'teal': '#17a2b8',
        'cyan': '#00d4ff',
        'ocean-green': '#2ec4b6',
        'coral': '#ff6b6b',
        'sand': '#ffeaa7',
        'navy': {
          900: '#001524',
          800: '#0f2027',
          700: '#203a43',
          600: '#2c5364',
        },
        'slate': '#334756',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in',
        'slide-in': 'slideIn 0.5s ease-out',
        'wave': 'wave 2s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'ocean': '0 10px 30px rgba(0, 119, 190, 0.3)',
        'deep': '0 15px 40px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
