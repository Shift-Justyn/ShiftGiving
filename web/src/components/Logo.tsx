import styled from 'styled-components';
import { GivingAppLogo } from './common/ShiftGivingLogo';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
}

const LogoContainer = styled.div<{ $size: string }>`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$size === 'small' ? '0.5rem' : '0.75rem')};
`;

const LogoText = styled.span<{ $variant: string; $size: string }>`
  font-size: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '1.25rem';
      case 'large':
        return '2rem';
      default:
        return '1.625rem';
    }
  }};
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${(props) => (props.$variant === 'light' ? '#ffffff' : props.theme.colors.primary.main)};
  text-shadow: ${(props) => (props.$variant === 'light' ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none')};
`;

const getLogoSize = (size: string): number => {
  switch (size) {
    case 'small':
      return 28;
    case 'large':
      return 48;
    default:
      return 36;
  }
};

export const Logo = ({ variant = 'light', size = 'medium' }: LogoProps) => {
  const iconColor = variant === 'light' ? '#ffffff' : '#00a0c4';

  return (
    <LogoContainer $size={size}>
      <GivingAppLogo size={getLogoSize(size)} color={iconColor} />
      <LogoText $variant={variant} $size={size}>
        <strong>Giving</strong>App
      </LogoText>
    </LogoContainer>
  );
};
