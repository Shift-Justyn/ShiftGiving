import styled from 'styled-components';

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InputLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
`;

export const InputHint = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;
