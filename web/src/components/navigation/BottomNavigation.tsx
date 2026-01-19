import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${(props) => props.theme.colors.background.card};
  border-top: 1px solid ${(props) => props.theme.colors.border.light};
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0 1rem;
  z-index: 100;

  @media (min-width: 48rem) {
    display: none;
  }
`;

const NavItem = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: ${(props) =>
    props.$active ? props.theme.colors.primary.main : props.theme.colors.text.tertiary};
  transition: color 0.2s;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  span {
    font-size: 0.75rem;
    font-weight: 500;
  }

  &:hover {
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

export const BottomNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <Nav>
      <NavItem $active={isActive('/')} onClick={() => navigate('/')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isActive('/') ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span>{t('nav.home')}</span>
      </NavItem>

      <NavItem $active={isActive('/donate')} onClick={() => navigate('/donate')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{t('nav.donate')}</span>
      </NavItem>

      <NavItem $active={isActive('/history')} onClick={() => navigate('/history')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <span>{t('nav.history')}</span>
      </NavItem>

      <NavItem $active={isActive('/messages')} onClick={() => navigate('/messages')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span>{t('nav.messages')}</span>
      </NavItem>
    </Nav>
  );
};
