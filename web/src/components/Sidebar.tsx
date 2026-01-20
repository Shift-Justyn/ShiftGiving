import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ShiftGivingLogo } from './common/ShiftGivingLogo';
import { ThemeToggle } from './ThemeToggle';

const SidebarContainer = styled(motion.div)<{ $isMobile: boolean; $isOpen: boolean }>`
  position: ${(props) => (props.$isMobile ? 'fixed' : 'relative')};
  top: 0;
  left: 0;
  height: 100vh;
  width: ${(props) => (props.$isMobile ? '16rem' : '16rem')};
  background: linear-gradient(180deg, #00a0c4 0%, #007a94 100%);
  box-shadow: 0.125rem 0 0.5rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 50;
  transform: ${(props) =>
    props.$isMobile && !props.$isOpen ? 'translateX(-100%)' : 'translateX(0)'};
  transition: transform 0.3s ease;

  @media (max-width: 48rem) {
    width: 16rem;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
`;

const HamburgerButton = styled.button`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 60;
  width: 2.5rem;
  height: 2.5rem;
  background: ${(props) => props.theme.colors.background.card};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${(props) => props.theme.colors.text.primary};
  }

  @media (min-width: 48rem) {
    display: none;
  }
`;

const LogoSection = styled.div`
  padding: 1.25rem;
  border-bottom: 0.0625rem solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoText = styled.h1`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.inverse};
  margin: 0;
  line-height: 1.2;
`;

const UserSection = styled.div`
  padding: 1.25rem;
  border-bottom: 0.0625rem solid rgba(255, 255, 255, 0.1);
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(0.625rem);
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text.inverse};
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.inverse};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserBadge = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const DonorBadge = styled.span`
  display: inline-block;
  font-size: 0.625rem;
  font-weight: 700;
  color: #ffffff;
  background: #00a0c4;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 0.25rem;
`;

const NavSection = styled.nav`
  flex: 1;
  padding: 0 0.75rem;
  overflow-y: auto;
`;

const NavItem = styled.button<{ $isActive: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  background: ${(props) => (props.$isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent')};
  border: none;
  border-radius: 0.5rem;
  color: ${(props) => props.theme.colors.text.inverse};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem 0.75rem;
  border-top: 0.0625rem solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
};

const getDonorBadge = (email: string): string => {
  if (email === 'donor@example.com') {
    return 'GENEROUS GIVER';
  }
  if (email === 'orgadmin@example.com') {
    return 'COMMUNITY CHAMPION';
  }
  if (email === 'siteadmin@example.com') {
    return 'MONTHLY SUPPORTER';
  }
  return 'NEW DONOR';
};

export const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const navItems = [
    {
      label: t('sidebar.discover'),
      path: '/',
      icon: (
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      label: t('sidebar.createCampaign'),
      path: '/campaigns/create',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      label: t('sidebar.myImpact'),
      path: '/impact',
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      label: t('sidebar.history'),
      path: '/history',
      icon: (
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: t('sidebar.messages'),
      path: '/messages',
      icon: (
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
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: t('sidebar.settings'),
      path: '/settings',
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const userInitials = user ? getInitials(user.firstName, user.lastName) : 'U';
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userType = user?.userType || 'DONOR';
  const donorBadge = user ? getDonorBadge(user.email) : 'NEW DONOR';

  return (
    <>
      {isMobile && (
        <HamburgerButton onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? (
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </HamburgerButton>
      )}

      <AnimatePresence>
        {isMobile && isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <SidebarContainer $isMobile={isMobile} $isOpen={isOpen}>
        <LogoSection>
          <ShiftGivingLogo size={36} color="white" />
          <LogoText>Shift Giving</LogoText>
        </LogoSection>

        <UserSection>
          <UserProfile>
            <Avatar>
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={userName} />
              ) : (
                userInitials
              )}
            </Avatar>
            <UserInfo>
              <UserName>{userName}</UserName>
              <UserBadge>{userType}</UserBadge>
              <DonorBadge>{donorBadge}</DonorBadge>
            </UserInfo>
          </UserProfile>
        </UserSection>

        <NavSection>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              $isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavItem>
          ))}
        </NavSection>

        <SidebarFooter>
          <ThemeToggle variant="sidebar" />
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};
