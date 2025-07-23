// tailwind.config.js
import { gray } from 'tailwindcss/colors'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['bg-background', 'text-primary', 'focus:ring-accent'],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      gray,

      primary: { DEFAULT: '#1E293B' },
      secondary: { DEFAULT: '#64748B' },
      accent: { DEFAULT: '#0EA5E9' },
      background: { DEFAULT: '#F8FAFC' },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
  plugins: [],
}
