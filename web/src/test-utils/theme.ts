export const mockTheme = {
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
    background: {
      page: '#f9fafb',
      card: '#ffffff',
      input: '#ffffff',
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
    },
    error: '#ef4444',
    success: '#10b981',
  },
  fonts: {
    primary:
      "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
  typography: {
    body: { fontSize: '1rem' },
    small: { fontSize: '0.875rem' },
    h3: { fontSize: '1.5rem' },
    h4: { fontSize: '1.25rem' },
    fontWeights: {
      medium: 500,
      semibold: 600,
    },
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    default: '0.2s ease',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
  },
};
