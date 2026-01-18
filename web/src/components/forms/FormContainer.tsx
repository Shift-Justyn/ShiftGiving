import styled from 'styled-components';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main} 0%,
    ${(props) => props.theme.colors.primary.hover} 100%
  );
`;

export const FormCard = styled.div`
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 28rem;

  @media (max-width: 48rem) {
    padding: 2rem;
    max-width: 100%;
  }
`;
