import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AuthLayout, UserTypeToggle, SocialLoginButtons } from '../components/auth';
import type { UserType } from '../components/auth';
import {
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

const StyledInputHint = styled(InputHint)`
  color: #6b7280;
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

const CharityFields = styled.div`
  margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #ffffff;
  color: #1f2937;
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const RegisterPage = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('individual');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (userType === 'individual') {
      if (!firstName.trim()) {
        setError(t('auth.firstName') + ' is required');
        return;
      }
      if (!lastName.trim()) {
        setError(t('auth.lastName') + ' is required');
        return;
      }
    } else {
      if (!businessName.trim()) {
        setError('Business name is required');
        return;
      }
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
    <AuthLayout>
      <Card>
        <Title>Sign Up</Title>
        <UserTypeToggle value={userType} onChange={setUserType} disabled={loading} />
        <Form onSubmit={handleRegister}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {userType === 'individual' ? (
            <>
              <InputGroup>
                <StyledInputLabel htmlFor="firstName">{t('auth.firstName')} *</StyledInputLabel>
                <StyledInput
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
                <StyledInputLabel htmlFor="lastName">{t('auth.lastName')} *</StyledInputLabel>
                <StyledInput
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                  required
                />
              </InputGroup>
            </>
          ) : (
            <CharityFields>
              <InputGroup>
                <StyledInputLabel htmlFor="businessName">Business Name *</StyledInputLabel>
                <StyledInput
                  id="businessName"
                  type="text"
                  placeholder="Your Organization"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={loading}
                  required
                />
              </InputGroup>
              <InputGroup>
                <StyledInputLabel htmlFor="taxId">501(c)3 Number</StyledInputLabel>
                <StyledInput
                  id="taxId"
                  type="text"
                  placeholder="XX-XXXXXXX"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  disabled={loading}
                />
              </InputGroup>
              <InputGroup>
                <StyledInputLabel htmlFor="about">About</StyledInputLabel>
                <TextArea
                  id="about"
                  placeholder="Tell us about your organization..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  disabled={loading}
                />
              </InputGroup>
            </CharityFields>
          )}

          <InputGroup>
            <StyledInputLabel htmlFor="email">Email Address *</StyledInputLabel>
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

          {userType === 'individual' && (
            <InputGroup>
              <StyledInputLabel htmlFor="password">{t('auth.password')} *</StyledInputLabel>
              <StyledInput
                id="password"
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <StyledInputHint>Must be at least 8 characters</StyledInputHint>
            </InputGroup>
          )}

          <StyledButton type="submit" $loading={loading} disabled={loading}>
            {loading ? t('auth.creatingAccount') : 'Continue'}
          </StyledButton>
        </Form>

        {userType === 'individual' && <SocialLoginButtons disabled={loading} />}

        <StyledFormFooter>
          Have an Account? <FormLink to="/login">Log In</FormLink>
        </StyledFormFooter>
      </Card>
    </AuthLayout>
  );
};
