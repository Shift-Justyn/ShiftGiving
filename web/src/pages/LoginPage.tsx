import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Shield, Clock, Heart } from 'lucide-react';
import { AuthLayout, SocialLoginButtons } from '../components/auth';
import { Form, Input, InputGroup, InputLabel, Button, ErrorMessage } from '../components/forms';

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Card = styled(motion.div)`
  background: #ffffff;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow:
    0 0.5rem 2rem rgba(0, 0, 0, 0.12),
    0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 26rem;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const Tagline = styled.p`
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
`;

const TrustBadgesContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const TrustBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border: 1px solid #7dd3fc;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #0369a1;
  box-shadow: 0 1px 2px rgba(14, 165, 233, 0.15);

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  align-items: center;
  pointer-events: none;

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.25rem;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: #6b7280;
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const focusGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 160, 196, 0.4); }
  70% { box-shadow: 0 0 0 0.25rem rgba(0, 160, 196, 0.1); }
  100% { box-shadow: 0 0 0 0.25rem rgba(0, 160, 196, 0.1); }
`;

const StyledInput = styled(Input)<{ $hasIcon?: boolean }>`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #1f2937;
  padding-left: ${(props) => (props.$hasIcon ? '2.75rem' : '1rem')};
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: ${(props) => props.theme.colors.primary.main};
    box-shadow: 0 0 0 0.25rem rgba(0, 160, 196, 0.1);
    animation: ${focusGlow} 0.3s ease;
  }
`;

const StyledInputLabel = styled(InputLabel)`
  color: #374151;
`;

const ForgotPasswordLink = styled.div`
  text-align: right;
  margin-top: 0.5rem;
  margin-bottom: 1rem;

  a {
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.primary.main};
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${(props) => props.theme.colors.primary.hover};
      text-decoration: underline;
    }
  }
`;

const StyledButton = styled(Button)`
  background: ${(props) => props.theme.colors.primary.main};
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.primary.hover};
    transform: translateY(-1px);
    box-shadow: 0 0.25rem 0.75rem rgba(0, 160, 196, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 26rem;
`;

export const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError(t('auth.invalidEmail'));
      return;
    }

    if (!password) {
      setError(t('auth.passwordRequired'));
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError(t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <LoginContainer>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <WelcomeSection>
            <Title>Welcome Back</Title>
            <Tagline>Sign in to continue making a difference</Tagline>
          </WelcomeSection>
          <Form onSubmit={handleLogin}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <InputGroup>
              <StyledInputLabel htmlFor="email">{t('auth.email')}</StyledInputLabel>
              <InputWrapper>
                <InputIcon>
                  <Mail />
                </InputIcon>
                <StyledInput
                  id="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  $hasIcon
                />
              </InputWrapper>
            </InputGroup>
            <InputGroup>
              <StyledInputLabel htmlFor="password">{t('auth.password')}</StyledInputLabel>
              <InputWrapper>
                <InputIcon>
                  <Lock />
                </InputIcon>
                <StyledInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  $hasIcon
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </PasswordToggle>
              </InputWrapper>
            </InputGroup>
            <ForgotPasswordLink>
              <a href="/forgot-password">Forgot password?</a>
            </ForgotPasswordLink>
            <StyledButton type="submit" $loading={loading} disabled={loading}>
              {loading ? t('auth.signingIn') : 'Continue'}
            </StyledButton>
          </Form>
          <SocialLoginButtons disabled={loading} />
        </Card>
        <TrustBadgesContainer
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          <TrustBadge>
            <Shield />
            Secure Login
          </TrustBadge>
          <TrustBadge>
            <Heart />
            No Spam, Ever
          </TrustBadge>
          <TrustBadge>
            <Clock />2 Min Setup
          </TrustBadge>
        </TrustBadgesContainer>
      </LoginContainer>
    </AuthLayout>
  );
};
