import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'], theme: { extend: { colors: { rakumon: {50:'#f3faf5',100:'#e4f4e8',500:'#5aa870',700:'#34794a'} } } }, plugins: [] };
export default config;
