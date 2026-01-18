import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const FormFooter = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;

export const FormLink = styled(Link)`
  color: ${(props) => props.theme.colors.primary.main};
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary.hover};
  }
`;
