/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Primária EduCash (Floresta / Crescimento / Fintech Educacional)
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488', // Variação primária vibrante
          700: '#0F766E', // Cor primária oficial aprovada (WCAG AA: 5.52:1)
          800: '#115E59', // Borda inferior tátil 3D
          900: '#134E4A',
          950: '#042F2E',
        },
        // Paleta de Moedas Virtuais e Recompensas (EduCoins)
        educoins: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Âmbar vibrante
          600: '#D97706', // Âmbar/Ouro sólido aprovado
          700: '#B45309', // Borda tátil EduCoins (WCAG AA: 4.95:1)
          800: '#92400E',
          900: '#78350F',
        },
        // Paleta de Experiência e Sabedoria (Pontos de XP / Conhecimento)
        xp: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // Índigo vibrante
          600: '#4F46E5', // Índigo sólido (WCAG AA: 4.60:1)
          700: '#4338CA', // Borda tátil XP
          800: '#3730A3',
          900: '#312E81',
        },
        // Superfícies refinadas para light e dark themes
        surface: {
          light: '#FFFFFF',
          lightMuted: '#F8FAFC',
          dark: '#1E293B',
          darkMuted: '#0B1120',
        },
        // Bordas estruturais
        line: {
          light: '#E2E8F0',
          lightStrong: '#CBD5E1',
          dark: '#334155',
          darkStrong: '#475569',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '1rem',       // 16px (raio moderno e suave para cartões)
        cardSm: '0.75rem',  // 12px
        cardLg: '1.5rem',   // 24px
        button: '0.75rem',  // 12px (raio tátil para botões e inputs)
        buttonSm: '0.5rem', // 8px
        badge: '9999px',    // pílulas / indicadores de status
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        tactile: '0 3px 0 0 rgba(15, 118, 110, 0.9)',
        'tactile-brand': '0 3px 0 0 #0F766E',
        'tactile-coins': '0 3px 0 0 #B45309',
        'tactile-xp': '0 3px 0 0 #4338CA',
        'tactile-neutral': '0 3px 0 0 #CBD5E1',
        'tactile-neutral-dark': '0 3px 0 0 #334155',
      },
    },
  },
  plugins: [],
};
