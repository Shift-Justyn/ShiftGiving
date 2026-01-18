import styled from 'styled-components';

interface ButtonProps {
  $loading?: boolean;
}

export const Button = styled.button<ButtonProps>`
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.inverse};
  background: ${(props) =>
    props.$loading ? props.theme.colors.text.secondary : props.theme.colors.primary.main};
  border: none;
  border-radius: 0.5rem;
  cursor: ${(props) => (props.$loading ? 'not-allowed' : 'pointer')};
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$loading ? props.theme.colors.text.secondary : props.theme.colors.primary.hover};
  }

  &:active {
    transform: ${(props) => (props.$loading ? 'none' : 'translateY(0.0625rem)')};
  }
`;
