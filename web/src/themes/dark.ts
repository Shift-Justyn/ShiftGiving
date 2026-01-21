import { Theme } from './types';

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: {
      main: '#22d3ee',
      hover: '#06b6d4',
      light: '#164e63',
      gradient: {
        start: '#22d3ee',
        end: '#0891b2',
      },
    },
    accent: {
      orange: '#FB923C',
      orangeLight: '#431407',
      pink: '#F472B6',
      pinkLight: '#500724',
    },
    background: {
      page: '#111827',
      card: '#1f2937',
      input: '#374151',
      elevated: '#374151',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      tertiary: '#9ca3af',
      inverse: '#111827',
    },
    border: {
      light: '#374151',
      medium: '#4b5563',
      focus: '#22d3ee',
    },
    error: '#f87171',
    errorLight: '#450a0a',
    errorBackground: '#450a0a',
    success: '#34d399',
    successLight: '#022c22',
    warning: '#FBBF24',
    warningLight: '#451a03',
    surface: '#1f2937',
    textSecondary: '#d1d5db',
    primaryOpacity10: 'rgba(34, 211, 238, 0.1)',
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
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
    card: '0 4px 15px rgba(0, 0, 0, 0.3), 0 2px 5px rgba(0, 0, 0, 0.2)',
    cardHover: '0 20px 40px rgba(34, 211, 238, 0.15), 0 8px 16px rgba(0, 0, 0, 0.3)',
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
