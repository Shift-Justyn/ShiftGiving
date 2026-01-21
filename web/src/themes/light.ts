import { Theme } from './types';

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: {
      main: '#00a0c4',
      hover: '#0891b2',
      light: '#e0f7fa',
      gradient: {
        start: '#00a0c4',
        end: '#007a94',
      },
    },
    accent: {
      orange: '#F97316',
      orangeLight: '#FFF7ED',
      pink: '#EC4899',
      pinkLight: '#FDF2F8',
    },
    background: {
      page: '#f9fafb',
      card: '#ffffff',
      input: '#ffffff',
      elevated: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      inverse: '#ffffff',
    },
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      focus: '#00a0c4',
    },
    error: '#ef4444',
    errorLight: '#FEF2F2',
    errorBackground: '#FEF2F2',
    success: '#10b981',
    successLight: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    surface: '#ffffff',
    textSecondary: '#6b7280',
    primaryOpacity10: 'rgba(0, 160, 196, 0.1)',
  },
  fonts: {
    primary:
      "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
  typography: {
    display: {
      size: '2.5rem',
      weight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
    },
    h1: {
      size: '1.75rem',
      weight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      size: '1.25rem',
      weight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      size: '1.125rem',
      weight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    body: {
      size: '1rem',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
      fontSize: '1rem',
    },
    bodySmall: {
      size: '0.875rem',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
    },
    small: {
      size: '0.875rem',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
      fontSize: '0.875rem',
    },
    caption: {
      size: '0.75rem',
      weight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    button: {
      size: '0.875rem',
      weight: 600,
      lineHeight: 1.25,
      letterSpacing: '0.01em',
    },
    fontWeights: {
      medium: 500,
      semibold: 600,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    card: '0 4px 15px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.08)',
    cardHover: '0 20px 40px rgba(0, 160, 196, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  transitions: {
    default: '0.2s ease',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
};
