import { Theme } from './types';

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: {
      main: '#00a0c4',
      hover: '#0891b2',
      light: '#e0f7fa',
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
};
