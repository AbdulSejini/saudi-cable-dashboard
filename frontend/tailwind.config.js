/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Saudi Cable Brand Colors
        'saudi-cable': {
          orange: '#F39200',        // Primary Orange - الطاقة والنحاس
          'orange-light': '#FFB84D',
          'orange-dark': '#CC7A00',
          dark: '#2E2D2C',          // Dark Grey - الرصانة والقوة
          'dark-light': '#4A4948',
          'dark-lighter': '#666564',
          // Tints
          'orange-10': '#FEF5E6',
          'orange-20': '#FDE9CC',
          'orange-40': '#FBCD99',
          'orange-60': '#F9B166',
          'dark-10': '#EAEAEA',
          'dark-20': '#D5D5D5',
          'dark-40': '#ABABAB',
          'dark-60': '#828180',
        },
        primary: {
          50: '#FEF5E6',
          100: '#FDE9CC',
          200: '#FBCD99',
          300: '#F9B166',
          400: '#F7A533',
          500: '#F39200',   // Main Saudi Cable Orange
          600: '#CC7A00',
          700: '#A66300',
          800: '#804C00',
          900: '#593500',
        },
        secondary: {
          50: '#F5F5F5',
          100: '#EAEAEA',
          200: '#D5D5D5',
          300: '#ABABAB',
          400: '#828180',
          500: '#2E2D2C',   // Main Saudi Cable Dark
          600: '#252423',
          700: '#1C1B1A',
          800: '#131312',
          900: '#0A0909',
        },
        machine: {
          running: '#10B981',
          idle: '#F39200',      // Saudi Cable Orange for idle
          stopped: '#EF4444',
          maintenance: '#8B5CF6',
        },
        // Plant colors matching cable cross-section theme
        pcp1: '#F39200',       // Orange
        pcp2: '#2E2D2C',       // Dark
        pcp3: '#FFB84D',       // Light Orange
        cvline: '#CC7A00',     // Dark Orange
        pvc: '#4A4948',        // Light Dark
      },
      fontFamily: {
        // SST Arabic is the official font, using Tajawal as web fallback
        arabic: ['Tajawal', 'SST Arabic', 'sans-serif'],
        sans: ['Inter', 'SST Arabic', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'glow-orange': 'glowOrange 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(243, 146, 0, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(243, 146, 0, 0.8)' },
        },
        glowOrange: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(243, 146, 0, 0.3)' },
          '50%': { boxShadow: '0 0 15px rgba(243, 146, 0, 0.6)' },
        },
      },
      boxShadow: {
        'saudi-cable': '0 4px 14px 0 rgba(243, 146, 0, 0.25)',
        'saudi-cable-lg': '0 10px 40px 0 rgba(243, 146, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
