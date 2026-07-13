import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rakumon: {
          bg: '#F1EEE8',
          sidebar: '#FCFAF7',
          card: '#FCFAF7',
          green: '#6F8F7B',
          greenHover: '#52705F',
          light: '#EDF2ED',
          border: '#D8D4CD',
          text: '#26332E',
          body: '#52605A',
          caption: '#79847E',
          danger: '#F8EEEA',
          dangerText: '#9F5F4D',
          warning: '#F0DDD5',
          table: '#DCE6DD',
          input: '#F7F4EF',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'ui-sans-serif'],
        zen: ['Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif'],
        number: ['Inter', 'ui-sans-serif'],
      },
      boxShadow: {
        premium: '0 18px 42px rgba(38,51,46,0.08)',
        premiumHover: '0 22px 48px rgba(38,51,46,0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
