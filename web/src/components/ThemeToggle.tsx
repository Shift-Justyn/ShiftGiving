import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const ToggleButton = styled.button`
  background: ${(props) => props.theme.colors.background.card};
  border: 0.0625rem solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  transition:
    background 0.2s,
    border-color 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.primary.light};
    border-color: ${(props) => props.theme.colors.primary.main};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: ${(props) => props.theme.colors.text.primary};
  }
`;

const SunIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

export const ThemeToggle = () => {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useTheme();
  const ariaLabel = mode === 'light' ? t('theme.switchToDark') : t('theme.switchToLight');

  return (
    <ToggleButton onClick={toggleTheme} aria-label={ariaLabel}>
      {mode === 'light' ? <MoonIcon /> : <SunIcon />}
    </ToggleButton>
  );
};
