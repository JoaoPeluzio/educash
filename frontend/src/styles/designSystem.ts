/**
 * EduCash — Sistema de Design Unificado (Etapa 7B: Fundação do Design System)
 * 
 * Diretrizes visuais inspiradas na clareza, progressão e feedback do Duolingo,
 * combinadas com a sobriedade e sofisticação de interfaces modernas de fintech juvenil (10 a 18 anos).
 */

export const DESIGN_TOKENS = {
  // 1. Cores Semânticas Oficiais do EduCash
  colors: {
    // Primária (Ação Principal, Conclusão de Lição, Marca)
    brand: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6',
      600: '#0D9488', // Ação Primária (Vibrante)
      700: '#0F766E', // Ação Primária Sólida / Borda Tátil (WCAG AA: 5.52:1)
      800: '#115E59', // Sombra 3D / Estado Ativo
      900: '#134E4A',
      950: '#042F2E',
    },
    // Moedas Virtuais e Recompensas (EduCoins)
    educoins: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Ouro vibrante
      600: '#D97706', // Ouro sólido
      700: '#B45309', // Borda tátil EduCoins (WCAG AA: 4.95:1)
      800: '#92400E',
      900: '#78350F',
    },
    // Experiência de Aprendizado (Pontos de XP e Conhecimento)
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
    // Feedback Pedagógico Imediato
    feedback: {
      success: {
        bgLight: '#ECFDF5',
        borderLight: '#A7F3D0',
        textLight: '#065F46', // WCAG AAA
        base: '#10B981',
        edge: '#047857',
        bgDark: 'rgba(6, 95, 70, 0.25)',
        borderDark: '#047857',
        textDark: '#6EE7B7',
      },
      error: {
        bgLight: '#FFF1F2',
        borderLight: '#FECDD3',
        textLight: '#9F1239', // WCAG AAA
        base: '#F43F5E',
        edge: '#BE123C',
        bgDark: 'rgba(159, 18, 57, 0.25)',
        borderDark: '#BE123C',
        textDark: '#FDA4AF',
      },
      warning: {
        bgLight: '#FFFBEB',
        borderLight: '#FDE68A',
        textLight: '#78350F', // WCAG AAA (8.75:1)
        base: '#F59E0B',
        edge: '#B45309',
        bgDark: 'rgba(146, 64, 14, 0.25)',
        borderDark: '#B45309',
        textDark: '#FCD34D',
      },
    },
    // Superfícies, Fundos e Bordas
    surface: {
      light: '#FFFFFF',
      lightMuted: '#F8FAFC',
      lightElevated: '#FFFFFF',
      dark: '#1E293B',
      darkMuted: '#0B1120',
      darkElevated: '#1E293B',
    },
    line: {
      light: '#E2E8F0',
      lightStrong: '#CBD5E1',
      dark: '#334155',
      darkStrong: '#475569',
    },
    text: {
      lightPrimary: '#0F172A',
      lightSecondary: '#475569',
      lightMuted: '#64748B',
      darkPrimary: '#F8FAFC',
      darkSecondary: '#94A3B8',
      darkMuted: '#64748B',
    },
  },

  // 2. Tipografia e Escala
  typography: {
    fontFamily: '"Plus Jakarta Sans", Inter, system-ui, sans-serif',
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 800,
    },
    tracking: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.05em',
    },
  },

  // 3. Padrão de Iconografia Unificada (lucide-react)
  icons: {
    strokeWidth: 2,
    sizes: {
      xs: 14,
      sm: 16, // Indicadores secundários, tags
      md: 20, // Menus, botões, opções de atividades
      lg: 24, // Títulos, cabeçalhos, destaques
      xl: 32, // Emblemas de conquista, medalhões
      hero: 40,
    },
  },

  // 4. Raios de Borda
  radii: {
    card: '1rem', // 16px
    cardLg: '1.5rem', // 24px
    button: '0.875rem', // 14px
    pill: '9999px',
    input: '0.75rem', // 12px
  },

  // 5. Acessibilidade e Áreas de Toque (WCAG 2.5.5)
  accessibility: {
    minTouchTarget: '44px',
    comfortableTouchTarget: '48px',
  },
} as const;

/**
 * Classes utilitárias padronizadas para botões táteis (Duolingo-inspired / Modern Fintech)
 * Botões com relevo tátil discreto e funcional (sem exagero caricato).
 */
export const BUTTON_CLASSES = {
  // Botão Primário Verde EduCash
  primary:
    'min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 border-b-4 border-teal-950 active:border-b-0 active:translate-y-1 transition-all duration-150 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none disabled:border-b-0',

  // Botão Secundário / Superfície Neutra
  secondary:
    'min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:bg-slate-100 border border-slate-200 dark:border-slate-700 border-b-4 border-b-slate-300 dark:border-b-slate-900 active:border-b active:translate-y-0.5 transition-all duration-150 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none',

  // Botão Dourado / EduCoins
  coins:
    'min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-amber-500 hover:bg-amber-400 active:bg-amber-600 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all duration-150 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none',

  // Botão Índigo / XP
  xp:
    'min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all duration-150 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none',

  // Botão de Opção de Resposta em Atividades Interativas
  option:
    'w-full text-left p-4 rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 active:border-b-2 active:translate-y-0.5 transition-all duration-150 flex items-start gap-3.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',

  // Botão de Opção Selecionada
  optionSelected:
    'border-teal-600 dark:border-teal-400 border-b-4 border-b-teal-800 dark:border-b-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100',
} as const;

/**
 * Classes utilitárias padronizadas para cartões e superfícies
 */
export const CARD_CLASSES = {
  base: 'bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-colors',
  interactive:
    'bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:border-teal-300 dark:hover:border-teal-600/60 hover:shadow-sm transition-all',
  elevated: 'bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm',
} as const;
