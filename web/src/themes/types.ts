export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: {
      main: string;
      hover: string;
      light: string;
      gradient: {
        start: string;
        end: string;
      };
    };
    accent: {
      orange: string;
      orangeLight: string;
      pink: string;
      pinkLight: string;
    };
    background: {
      page: string;
      card: string;
      input: string;
      elevated: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    border: {
      light: string;
      medium: string;
      focus: string;
    };
    error: string;
    errorLight: string;
    errorBackground: string;
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    surface: string;
    textSecondary: string;
    primaryOpacity10: string;
  };
  fonts: {
    primary: string;
  };
  typography: {
    display: {
      size: string;
      weight: number;
      lineHeight: number;
      letterSpacing: string;
    };
    h1: {
      size: string;
      weight: number;
      lineHeight: number;
      letterSpacing: string;
    };
    h2: {
      size: string;
      weight: number;
      lineHeight: number;
      letterSpacing: string;
    };
    h3: {
      size: string;
      weight: number;
      lineHeight: number;
      letterSpacing: string;
    };
    body: {
      size: string;
      weight: number;
      lineHeight: number;
      letterSpacing: string;
      fontSize: string;
    };
    bodySmall: {
      size: string;
      weight: number;
      lineHeight: number;
      letterSpacing: string;
    };
    small: {
      size: string;
      weight: number;
      lineHeight: number;
      letterSpacing: string;
      fontSize: string;
    };
    caption: {
      size: string;
      weight: number;
      lineHeight: number;
      letterSpacing: string;
    };
    button: {
      size: string;
      weight: number;
      lineHeight: number;
      letterSpacing: string;
    };
    fontWeights: {
      medium: number;
      semibold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    card: string;
    cardHover: string;
  };
  animation: {
    fast: string;
    normal: string;
    slow: string;
    easing: string;
  };
  transitions: {
    default: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
}
