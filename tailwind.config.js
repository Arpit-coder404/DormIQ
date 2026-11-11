/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0C0E0D',
          dark: '#080908',
          light: '#131615',
        },
        graphite: {
          DEFAULT: '#171B19',
          light: '#222825',
          border: '#2A322E',
        },
        forest: {
          DEFAULT: '#183D31',
          light: '#235343',
          dark: '#0E241D',
        },
        lime: {
          DEFAULT: '#C8FF62',
          glow: '#D8FF8A',
          dark: '#9AC644',
        },
        sage: {
          DEFAULT: '#A4B99E',
          light: '#C0D1BB',
          dark: '#7D9577',
        },
        ivory: {
          DEFAULT: '#F4F2E9',
          muted: '#E6E3D5',
        },
        mutedGrey: '#929B94',
        warningAmber: '#F2B84B',
        alertCoral: '#FF756E',
        coolBlue: '#8BAEFF',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(200, 255, 98, 0.08) 1px, transparent 1px)",
        'blueprint': "linear-gradient(to right, rgba(164, 185, 158, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(164, 185, 158, 0.05) 1px, transparent 1px)",
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
};

