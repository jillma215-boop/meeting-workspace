import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rakumon: {
          bg: '#F7F4EE',
          sidebar: '#FBFAF6',
          card: '#FFFFFF',
          green: '#2F8F5B',
          greenHover: '#26784C',
          light: '#EDF8F2',
          border: '#E5E9E4',
          text: '#1E2B22',
          body: '#5F695F',
          caption: '#8B938B',
          danger: '#FDECEC',
          dangerText: '#D96C6C',
          warning: '#F5C66A',
          table: '#F6F7F4',
          input: '#FAFAF8',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'ui-sans-serif'],
        zen: ['Zen Kaku Gothic New', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif'],
        number: ['Inter', 'ui-sans-serif'],
      },
      boxShadow: {
        premium: '0 10px 30px rgba(0,0,0,0.04)',
        premiumHover: '0 14px 36px rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [],
};
export default config;
