import styled from 'styled-components';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
}

const LogoContainer = styled.div<{ $size: string }>`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$size === 'small' ? '0.5rem' : '0.75rem')};
`;

const LogoIcon = styled.svg<{ $size: string }>`
  width: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '1.75rem';
      case 'large':
        return '3rem';
      default:
        return '2.25rem';
    }
  }};
  height: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '1.75rem';
      case 'large':
        return '3rem';
      default:
        return '2.25rem';
    }
  }};
`;

const LogoText = styled.span<{ $variant: string; $size: string }>`
  font-size: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '1.25rem';
      case 'large':
        return '2rem';
      default:
        return '1.5rem';
    }
  }};
  font-weight: 600;
  color: ${(props) => (props.$variant === 'light' ? '#ffffff' : props.theme.colors.primary.main)};
`;

export const Logo = ({ variant = 'light', size = 'medium' }: LogoProps) => {
  const iconColor = variant === 'light' ? '#ffffff' : '#00a0c4';

  return (
    <LogoContainer $size={size}>
      <LogoIcon $size={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={iconColor}
        />
        <path
          d="M12 6.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"
          fill={variant === 'light' ? '#00a0c4' : '#ffffff'}
        />
      </LogoIcon>
      <LogoText $variant={variant} $size={size}>
        ShiftGiving
      </LogoText>
    </LogoContainer>
  );
};
