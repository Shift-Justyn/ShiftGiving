import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'default' | 'sidebar';
}

const ToggleButton = styled.button<{ $variant: 'default' | 'sidebar' }>`
  background: ${(props) =>
    props.$variant === 'sidebar'
      ? 'rgba(255, 255, 255, 0.15)'
      : props.theme.colors.background.card};
  border: 0.0625rem solid
    ${(props) =>
      props.$variant === 'sidebar' ? 'rgba(255, 255, 255, 0.2)' : props.theme.colors.border.light};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 0.625rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  transition:
    background ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easing},
    border-color ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easing},
    transform ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easing};

  &:hover {
    background: ${(props) =>
      props.$variant === 'sidebar'
        ? 'rgba(255, 255, 255, 0.25)'
        : props.theme.colors.primary.light};
    border-color: ${(props) =>
      props.$variant === 'sidebar' ? 'rgba(255, 255, 255, 0.3)' : props.theme.colors.primary.main};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: ${(props) =>
      props.$variant === 'sidebar' ? '#ffffff' : props.theme.colors.text.primary};
    stroke: ${(props) =>
      props.$variant === 'sidebar' ? '#ffffff' : props.theme.colors.text.primary};
    stroke-width: 1.5;
    transition: fill ${(props) => props.theme.animation.fast}
      ${(props) => props.theme.animation.easing};
  }
`;

const SunIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

export const ThemeToggle = ({ variant = 'default' }: ThemeToggleProps) => {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useTheme();
  const ariaLabel = mode === 'light' ? t('theme.switchToDark') : t('theme.switchToLight');

  return (
    <ToggleButton onClick={toggleTheme} aria-label={ariaLabel} $variant={variant}>
      {mode === 'light' ? <MoonIcon /> : <SunIcon />}
    </ToggleButton>
  );
};
