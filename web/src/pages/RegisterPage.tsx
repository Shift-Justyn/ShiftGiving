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
  InputHint,
  Button,
  ErrorMessage,
  FormFooter,
  FormLink,
} from '../components/forms';

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const RegisterPage = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError(t('auth.firstName') + ' is required');
      return;
    }

    if (!lastName.trim()) {
      setError(t('auth.lastName') + ' is required');
      return;
    }

    if (!validateEmail(email)) {
      setError(t('auth.invalidEmail'));
      return;
    }

    if (!validatePassword(password)) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      await register(email, password, firstName, lastName);
      navigate('/login');
    } catch {
      setError(t('auth.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormCard>
        <FormTitle>{t('auth.createAccount')}</FormTitle>
        <Form onSubmit={handleRegister}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <InputGroup>
            <InputLabel htmlFor="firstName">{t('auth.firstName')}</InputLabel>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
              required
            />
          </InputGroup>
          <InputGroup>
            <InputLabel htmlFor="lastName">{t('auth.lastName')}</InputLabel>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
              required
            />
          </InputGroup>
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
            <InputHint>{t('auth.passwordTooShort')}</InputHint>
          </InputGroup>
          <Button type="submit" $loading={loading} disabled={loading}>
            {loading ? t('auth.creatingAccount') : t('auth.register')}
          </Button>
        </Form>
        <FormFooter>
          {t('auth.haveAccount')} <FormLink to="/login">{t('auth.signIn')}</FormLink>
        </FormFooter>
      </FormCard>
    </FormContainer>
  );
};
