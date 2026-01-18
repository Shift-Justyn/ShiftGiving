import { Theme } from './types';

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: {
      main: '#22d3ee',
      hover: '#06b6d4',
      light: '#164e63',
    },
    background: {
      page: '#111827',
      card: '#1f2937',
      input: '#374151',
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
    },
    error: '#f87171',
    success: '#34d399',
  },
};
