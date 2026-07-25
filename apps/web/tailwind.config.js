/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Light theme surface colors (Bitrix24 style)
        surface: {
          DEFAULT: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        // Accent: WLinks Orange (Bitrix24 style)
        accent: {
          DEFAULT: '#e96c3c',
          50: '#fff4f0',
          100: '#ffe4db',
          200: '#ffc9b8',
          300: '#ffa98a',
          400: '#ff8a5c',
          500: '#e96c3c',
          600: '#d4582a',
          700: '#b84a22',
          800: '#9c3e1c',
          900: '#803318',
        },
        // Success: Vibrant emerald
        success: {
          DEFAULT: '#10b981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Warning: Warm amber
        warning: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Danger: Coral red
        danger: {
          DEFAULT: '#ef4444',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Score gradient colors
        score: {
          excellent: '#10b981',
          good: '#22c55e',
          regular: '#eab308',
          risk: '#f97316',
          critical: '#ef4444',
        },
        // Text colors (light theme)
        text: {
          primary: '#1a1a1a',
          secondary: '#525252',
          muted: '#737373',
          inverse: '#ffffff',
        },
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-lg': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-md': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(233, 108, 60, 0.25)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.25)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.25)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.25)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)',
        'sidebar': '2px 0 8px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(233, 108, 60, 0.2)' },
          '50%': { boxShadow: '0 0 15px rgba(233, 108, 60, 0.4)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': `
          radial-gradient(at 40% 20%, rgba(233, 108, 60, 0.03) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(16, 185, 129, 0.02) 0px, transparent 50%)
        `,
      },
    },
  },
  plugins: [],
}
