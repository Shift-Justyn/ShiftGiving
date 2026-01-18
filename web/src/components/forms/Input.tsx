import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 0.125rem solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background: ${(props) => props.theme.colors.background.input};
  color: ${(props) => props.theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
    box-shadow: 0 0 0 0.1875rem ${(props) => props.theme.colors.primary.light};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.tertiary};
  }
`;
