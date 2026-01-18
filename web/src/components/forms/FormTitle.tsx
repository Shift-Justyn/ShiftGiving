import styled from 'styled-components';

export const FormTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 2rem 0;
  text-align: center;

  @media (max-width: 48rem) {
    font-size: 1.75rem;
  }
`;
