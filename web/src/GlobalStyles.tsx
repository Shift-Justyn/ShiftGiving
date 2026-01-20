import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${(props) => props.theme.fonts.primary};
    font-size: ${(props) => props.theme.typography.body.size};
    font-weight: ${(props) => props.theme.typography.body.weight};
    line-height: ${(props) => props.theme.typography.body.lineHeight};
    letter-spacing: ${(props) => props.theme.typography.body.letterSpacing};
    color: ${(props) => props.theme.colors.text.primary};
    background-color: ${(props) => props.theme.colors.background.page};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color ${(props) => props.theme.animation.normal} ${(props) => props.theme.animation.easing},
                color ${(props) => props.theme.animation.normal} ${(props) => props.theme.animation.easing};
  }

  button, input, textarea, select {
    font-family: ${(props) => props.theme.fonts.primary};
    font-size: inherit;
  }

  /* Focus states for accessibility */
  :focus {
    outline: none;
  }

  :focus-visible {
    outline: 0.125rem solid ${(props) => props.theme.colors.border.focus};
    outline-offset: 0.125rem;
    border-radius: ${(props) => props.theme.borderRadius.sm};
  }

  /* Ensure minimum touch target size (44x44pt) */
  button,
  [role="button"],
  input[type="submit"],
  input[type="button"],
  input[type="reset"],
  a {
    min-height: 2.75rem;
    min-width: 2.75rem;
  }

  /* Exception for inline links */
  a:not([class]) {
    min-height: auto;
    min-width: auto;
  }

  /* Remove default link styling */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Smooth scrolling */
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }

  /* Selection styling */
  ::selection {
    background-color: ${(props) => props.theme.colors.primary.light};
    color: ${(props) => props.theme.colors.text.primary};
  }

  /* Scrollbar styling for webkit browsers */
  ::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.background.page};
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.border.medium};
    border-radius: ${(props) => props.theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.text.tertiary};
  }
`;
