import styled from 'styled-components';

export const ErrorMessage = styled.div`
  padding: 0.875rem 1rem;
  background: ${(props) => (props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2')};
  color: ${(props) => (props.theme.mode === 'dark' ? '#fecaca' : '#991b1b')};
  border: 0.125rem solid ${(props) => (props.theme.mode === 'dark' ? '#991b1b' : '#fecaca')};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
`;
