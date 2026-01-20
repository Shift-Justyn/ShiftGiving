import styled from 'styled-components';

export const GlassCard = styled.div`
  backdrop-filter: blur(0.625rem);
  background: ${(props) =>
    props.theme.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(31, 41, 55, 0.8)'};
  border: 0.0625rem solid
    ${(props) =>
      props.theme.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 1.5rem rgba(0, 0, 0, 0.1);
`;
