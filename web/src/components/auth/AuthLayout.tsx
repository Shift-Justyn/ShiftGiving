import { ReactNode } from 'react';
import styled from 'styled-components';
import { Logo } from '../Logo';

interface AuthLayoutProps {
  children: ReactNode;
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(0, 160, 196, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(0, 160, 196, 0.05) 0%, transparent 50%);
  pointer-events: none;
`;

const Header = styled.header`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main} 0%,
    #0088a8 100%
  );
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: center;
  box-shadow:
    0 0.25rem 1rem rgba(0, 0, 0, 0.15),
    0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  position: relative;
  overflow: hidden;
`;

const Footer = styled.footer`
  background: #2d3748;
  color: #ffffff;
  padding: 3rem 2rem 1.5rem;
`;

const FooterContent = styled.div`
  max-width: 75rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;

  @media (max-width: 48rem) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterSection = styled.div``;

const FooterLogo = styled.div`
  margin-bottom: 1rem;
`;

const FooterDescription = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: #a0aec0;
  margin: 0 0 1.5rem 0;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SocialIcon = styled.a`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.primary.main};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const FooterTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 1rem 0;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.5rem;

  a {
    font-size: 0.875rem;
    color: #a0aec0;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${(props) => props.theme.colors.primary.main};
    }
  }
`;

const ContactInfo = styled.div`
  font-size: 0.875rem;
  color: #a0aec0;
  line-height: 1.6;

  a {
    color: ${(props) => props.theme.colors.primary.main};
    text-decoration: none;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #4a5568;
  font-size: 0.875rem;
  color: #718096;
`;

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Container>
      <Header>
        <Logo variant="light" size="medium" />
      </Header>
      <Main>
        <BackgroundPattern />
        {children}
      </Main>
      <Footer>
        <FooterContent>
          <FooterSection>
            <FooterLogo>
              <Logo variant="light" size="small" />
            </FooterLogo>
            <FooterDescription>
              We empower communities by connecting donors with meaningful causes. Our platform makes
              giving simple, transparent, and impactful.
            </FooterDescription>
            <SocialLinks>
              <SocialIcon href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#" aria-label="Pinterest">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </SocialIcon>
            </SocialLinks>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Get Involved</FooterTitle>
            <FooterLinks>
              <FooterLink>
                <a href="#">About Us</a>
              </FooterLink>
              <FooterLink>
                <a href="#">Causes</a>
              </FooterLink>
              <FooterLink>
                <a href="#">Projects</a>
              </FooterLink>
              <FooterLink>
                <a href="#">Team</a>
              </FooterLink>
            </FooterLinks>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Contact</FooterTitle>
            <ContactInfo>
              1220 NE Station Crossing Dr
              <br />
              Suite 208, Grimes, IA 50111
              <br />
              <br />
              <a href="mailto:contact@shiftgiving.com">contact@shiftgiving.com</a>
              <br />
              1-515-224-7415
            </ContactInfo>
          </FooterSection>
        </FooterContent>
        <Copyright>&copy; 2020-2026 ShiftGiving LLC. All rights reserved.</Copyright>
      </Footer>
    </Container>
  );
};
