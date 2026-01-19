import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AuthLayout, SocialLoginButtons } from '../components/auth';
import {
  Form,
  Input,
  InputGroup,
  InputLabel,
  Button,
  ErrorMessage,
  FormFooter,
  FormLink,
} from '../components/forms';

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 2.5rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 26rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin: 0 0 2rem 0;
`;

const StyledInput = styled(Input)`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #1f2937;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: ${(props) => props.theme.colors.primary.main};
  }
`;

const StyledInputLabel = styled(InputLabel)`
  color: #374151;
`;

const StyledButton = styled(Button)`
  background: ${(props) => props.theme.colors.primary.main};

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.primary.hover};
  }
`;

const StyledFormFooter = styled(FormFooter)`
  color: #6b7280;
`;

export const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <Card>
        <Title>Log In</Title>
        <Form onSubmit={handleLogin}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <InputGroup>
            <StyledInputLabel htmlFor="email">{t('auth.email')}</StyledInputLabel>
            <StyledInput
              id="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </InputGroup>
          <InputGroup>
            <StyledInputLabel htmlFor="password">{t('auth.password')}</StyledInputLabel>
            <StyledInput
              id="password"
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </InputGroup>
          <StyledButton type="submit" $loading={loading} disabled={loading}>
            {loading ? t('auth.signingIn') : 'Continue'}
          </StyledButton>
        </Form>
        <SocialLoginButtons disabled={loading} />
        <StyledFormFooter>
          {t('auth.noAccount')} <FormLink to="/register">{t('auth.createOne')}</FormLink>
        </StyledFormFooter>
      </Card>
    </AuthLayout>
  );
};
