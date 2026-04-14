/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ChatGPT-like dark palette
        chat: {
          sidebar: '#171717',
          main: '#212121',
          surface: '#2f2f2f',
          border: '#3d3d3d',
          hover: '#2a2a2a',
          input: '#2f2f2f',
        },
        // Light mode palette
        light: {
          sidebar: '#f9f9f9',
          main: '#ffffff',
          surface: '#f4f4f4',
          border: '#e5e5e5',
          hover: '#ececec',
          input: '#f4f4f4',
        },
        // Brand accent (ChatGPT teal-green inspired)
        brand: {
          DEFAULT: '#10a37f',
          hover: '#0d9270',
          light: '#1aB990',
          muted: 'rgba(16,163,127,0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 0.18s ease-out',
        'fade-in': 'fadeIn 0.25s ease-out',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(-8px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
