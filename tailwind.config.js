/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.{html}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  variants: {
    opacity: ({ after }) => after(['disabled']),
  },
  plugins: [],
};
