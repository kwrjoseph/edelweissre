/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#333333',
        secondary: '#6c757d',
        accent: '#C5A46D',
        'badge-gray': '#808080',
        'badge-black': '#000000',
        border: '#E0E0E0',
        overlay: 'rgba(0, 0, 0, 0.6)',
        // Form colors matching screenshot
        'form-border': '#dee2e6',
        'form-text': '#6c757d',
        'primary-button': '#c5a483',
        'primary-button-border': '#a8896c',
        'primary-button-hover': '#b49477',
        'secondary-button': '#d2af91',
        'secondary-button-border': '#b49477',
        'secondary-button-hover': '#c5a483',
        // Dashboard colors
        'dashboard': {
          50: '#fef7e6',
          100: '#feebc0',
          200: '#fddd96',
          300: '#fbce6c',
          400: '#f9bf42',
          500: '#e3ae61', // Main dashboard brand color
          600: '#d89f4e',
          700: '#cc8f3b',
          800: '#c17f28',
          900: '#b56f15',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 15px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.12)',
        'icon': '0 2px 6px rgba(0, 0, 0, 0.15)',
        'marker': '0 2px 6px rgba(0, 0, 0, 0.3)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      transitionProperty: {
        'card': 'transform, box-shadow',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
}