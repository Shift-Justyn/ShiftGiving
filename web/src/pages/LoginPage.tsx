import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormContainer,
  FormCard,
  FormTitle,
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
    <FormContainer>
      <FormCard>
        <FormTitle>{t('auth.welcomeBack')}</FormTitle>
        <Form onSubmit={handleLogin}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <InputGroup>
            <InputLabel htmlFor="email">{t('auth.email')}</InputLabel>
            <Input
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
            <InputLabel htmlFor="password">{t('auth.password')}</InputLabel>
            <Input
              id="password"
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </InputGroup>
          <Button type="submit" $loading={loading} disabled={loading}>
            {loading ? t('auth.signingIn') : t('auth.login')}
          </Button>
        </Form>
        <FormFooter>
          {t('auth.noAccount')} <FormLink to="/register">{t('auth.createOne')}</FormLink>
        </FormFooter>
      </FormCard>
    </FormContainer>
  );
};
