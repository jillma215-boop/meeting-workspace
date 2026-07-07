import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'], theme: { extend: { colors: { rakumon: { bg:'#F7F8F4', card:'#FFFFFF', green:'#3BAA6A', light:'#EAF7EF', border:'#E3E8E2', text:'#16211D', muted:'#5E6A63', danger:'#FDECEC', dangerText:'#B42318' } }, fontFamily: { outfit:['Outfit','ui-sans-serif'], zen:['Zen Kaku Gothic New','system-ui','sans-serif'], inter:['Inter','ui-sans-serif'] }, boxShadow: { premium:'0 8px 24px rgba(24,34,25,0.06)' } } }, plugins: [] };
export default config;
