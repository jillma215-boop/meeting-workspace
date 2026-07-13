import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rakumon: {
          bg: '#F4F1EC',
          sidebar: '#FCFAF7',
          card: '#FCFAF7',
          green: '#8F9A88',
          greenHover: '#7E8A77',
          light: '#EEF1EA',
          border: '#DDD8D1',
          text: '#39443F',
          body: '#667068',
          caption: '#8B8F86',
          danger: '#F4E9E6',
          dangerText: '#A87972',
          warning: '#D7CCBE',
          table: '#F1EEE8',
          input: '#F8F5F0',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'ui-sans-serif'],
        zen: ['Zen Kaku Gothic New', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif'],
        number: ['Inter', 'ui-sans-serif'],
      },
      boxShadow: {
        premium: '0 18px 42px rgba(57,68,63,0.07)',
        premiumHover: '0 22px 48px rgba(57,68,63,0.10)',
      },
    },
  },
  plugins: [],
};
export default config;
