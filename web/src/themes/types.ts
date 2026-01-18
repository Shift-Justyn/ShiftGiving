export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: {
      main: string;
      hover: string;
      light: string;
    };
    background: {
      page: string;
      card: string;
      input: string;
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
    };
    error: string;
    success: string;
  };
}
