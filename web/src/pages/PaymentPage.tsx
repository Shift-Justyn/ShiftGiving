import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createDonation } from '../api/donations';

interface LocationState {
  amount: number;
  isAnonymous: boolean;
  message: string;
  campaignId: string;
  organizationId: string;
}

export const PaymentPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const state = location.state as LocationState;

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coverFees, setCoverFees] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [emailReceipt, setEmailReceipt] = useState(true);
  const [transactionId, setTransactionId] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const calculateTransactionFee = (amount: number) => {
    return amount * 0.029 + 0.5;
  };

  const calculateTotal = () => {
    const base = state?.amount || 0;
    const fee = coverFees ? calculateTransactionFee(base) : 0;
    return base + fee;
  };

  const generateTransactionId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `TXN-${timestamp}-${random}`.toUpperCase();
  };

  useEffect(() => {
    if (state?.amount) {
      setTransactionId(generateTransactionId());
    }
  }, []);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').substring(0, 19) : '';
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const getCardType = () => {
    const num = cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mastercard';
    if (num.startsWith('34') || num.startsWith('37')) return 'amex';
    if (num.startsWith('6011') || num.startsWith('65')) return 'discover';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !state) return;

    setLoading(true);
    setError('');

    try {
      const donation = await createDonation(
        {
          amount: state.amount,
          campaignId: state.campaignId,
          organizationId: state.organizationId,
          isAnonymous: state.isAnonymous,
          donorMessage: state.message || undefined,
          paymentMethod: 'card',
        },
        token
      );
      navigate(`/donations/${donation.id}/confirmation`);
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!state) {
    return (
      <ErrorContainer>
        <ErrorIcon>&#9888;</ErrorIcon>
        <ErrorText>{t('common.error')}</ErrorText>
        <BackLink onClick={() => navigate(`/campaigns/${id}/donate`)}>{t('common.back')}</BackLink>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(`/campaigns/${id}/donate`)}>
          <BackIcon>&larr;</BackIcon>
          {t('common.back')}
        </BackButton>
        <StepIndicator>
          <Step $completed>&#10003;</Step>
          <StepLine $completed />
          <Step $active>2</Step>
          <StepLine />
          <Step>3</Step>
        </StepIndicator>
      </Header>

      <ContentWrapper>
        <MainSection>
          <FormCard>
            <FormHeader>
              <CardIcon>&#128179;</CardIcon>
              <FormTitle>{t('donation.paymentInfo')}</FormTitle>
            </FormHeader>

            <Form onSubmit={handleSubmit}>
              {error && (
                <ErrorMessage>
                  <ErrorMessageIcon>&#9888;</ErrorMessageIcon>
                  {error}
                </ErrorMessage>
              )}

              <CardPreview $cardType={getCardType()}>
                <CardPreviewNumber>{cardNumber || '•••• •••• •••• ••••'}</CardPreviewNumber>
                <CardPreviewDetails>
                  <CardPreviewName>{cardholderName || 'YOUR NAME'}</CardPreviewName>
                  <CardPreviewExpiry>{expiryDate || 'MM/YY'}</CardPreviewExpiry>
                </CardPreviewDetails>
                {getCardType() && <CardBrand>{getCardType()?.toUpperCase()}</CardBrand>}
              </CardPreview>

              <InputGroup>
                <Label htmlFor="cardholderName">{t('donation.cardholderName')}</Label>
                <InputWrapper>
                  <InputIcon>&#128100;</InputIcon>
                  <Input
                    id="cardholderName"
                    type="text"
                    placeholder="John Doe"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="cardNumber">{t('donation.cardNumber')}</Label>
                <InputWrapper>
                  <InputIcon>&#128179;</InputIcon>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <InputRow>
                <InputGroup>
                  <Label htmlFor="expiryDate">{t('donation.expiryDate')}</Label>
                  <InputWrapper>
                    <InputIcon>&#128197;</InputIcon>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </InputWrapper>
                </InputGroup>

                <InputGroup>
                  <Label htmlFor="cvv">{t('donation.cvv')}</Label>
                  <InputWrapper>
                    <InputIcon>&#128274;</InputIcon>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      maxLength={4}
                      required
                    />
                  </InputWrapper>
                </InputGroup>
              </InputRow>

              <PaymentOptionsSection>
                <SectionLabel>Payment Options</SectionLabel>

                <CheckboxGroup>
                  <Checkbox as={motion.div} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <CheckboxInput
                      type="checkbox"
                      id="coverFees"
                      checked={coverFees}
                      onChange={(e) => setCoverFees(e.target.checked)}
                    />
                    <CheckboxLabel htmlFor="coverFees">
                      <CheckboxText>Cover Transaction Fees</CheckboxText>
                      <CheckboxSubtext>
                        Add {formatCurrency(calculateTransactionFee(state?.amount || 0))} to help
                        cover processing costs (2.9% + $0.50)
                      </CheckboxSubtext>
                    </CheckboxLabel>
                    <CheckboxIconWrapper
                      as={motion.div}
                      animate={{ scale: coverFees ? 1 : 0, opacity: coverFees ? 1 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      &#10003;
                    </CheckboxIconWrapper>
                  </Checkbox>

                  <Checkbox as={motion.div} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <CheckboxInput
                      type="checkbox"
                      id="isRecurring"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    <CheckboxLabel htmlFor="isRecurring">
                      <CheckboxText>Recurring Transaction</CheckboxText>
                      {isRecurring && (
                        <RecurringDropdown
                          as={motion.select}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          value={recurringFrequency}
                          onChange={(e) => setRecurringFrequency(e.target.value)}
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </RecurringDropdown>
                      )}
                    </CheckboxLabel>
                    <CheckboxIconWrapper
                      as={motion.div}
                      animate={{ scale: isRecurring ? 1 : 0, opacity: isRecurring ? 1 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      &#10003;
                    </CheckboxIconWrapper>
                  </Checkbox>

                  <Checkbox as={motion.div} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <CheckboxInput
                      type="checkbox"
                      id="emailReceipt"
                      checked={emailReceipt}
                      onChange={(e) => setEmailReceipt(e.target.checked)}
                    />
                    <CheckboxLabel htmlFor="emailReceipt">
                      <CheckboxText>Email Me A Receipt</CheckboxText>
                      <CheckboxSubtext>Send confirmation to your email address</CheckboxSubtext>
                    </CheckboxLabel>
                    <CheckboxIconWrapper
                      as={motion.div}
                      animate={{ scale: emailReceipt ? 1 : 0, opacity: emailReceipt ? 1 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      &#10003;
                    </CheckboxIconWrapper>
                  </Checkbox>
                </CheckboxGroup>

                <TransactionIdDisplay>
                  <TransactionIdLabel>Transaction ID</TransactionIdLabel>
                  <TransactionIdValue>{transactionId}</TransactionIdValue>
                </TransactionIdDisplay>
              </PaymentOptionsSection>

              <SecurityBadges>
                <Badge>
                  <BadgeIcon>&#128274;</BadgeIcon>
                  SSL Encrypted
                </Badge>
                <Badge>
                  <BadgeIcon>&#9989;</BadgeIcon>
                  PCI Compliant
                </Badge>
              </SecurityBadges>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    {t('donation.processing')}
                  </>
                ) : (
                  <>
                    {t('donation.completeDonation')}
                    <ButtonArrow>&rarr;</ButtonArrow>
                  </>
                )}
              </SubmitButton>
            </Form>
          </FormCard>
        </MainSection>

        <SideSection>
          <SummaryCard>
            <SummaryHeader>
              <SummaryIcon>&#128176;</SummaryIcon>
              <SummaryTitle>{t('donation.orderSummary')}</SummaryTitle>
            </SummaryHeader>

            <SummaryContent>
              <SummaryRow>
                <SummaryLabel>{t('donation.donationAmount')}</SummaryLabel>
                <SummaryValue>{formatCurrency(state.amount)}</SummaryValue>
              </SummaryRow>
              {coverFees && (
                <SummaryRow>
                  <SummaryLabel>Transaction Fees</SummaryLabel>
                  <SummaryValue>
                    {formatCurrency(calculateTransactionFee(state.amount))}
                  </SummaryValue>
                </SummaryRow>
              )}
              {state.isAnonymous && (
                <SummaryRow>
                  <SummaryLabel>Anonymous donation</SummaryLabel>
                  <SummaryBadge>&#10003;</SummaryBadge>
                </SummaryRow>
              )}
              {isRecurring && (
                <SummaryRow>
                  <SummaryLabel>Recurring {recurringFrequency}</SummaryLabel>
                  <SummaryBadge>&#10003;</SummaryBadge>
                </SummaryRow>
              )}
              <SummaryDivider />
              <TotalRow>
                <TotalLabel>{t('donation.total')}</TotalLabel>
                <TotalValue>{formatCurrency(calculateTotal())}</TotalValue>
              </TotalRow>
            </SummaryContent>
          </SummaryCard>

          <InfoCard>
            <InfoIcon>&#128274;</InfoIcon>
            <InfoContent>
              <InfoTitle>Secure Payment</InfoTitle>
              <InfoText>
                Your payment information is encrypted and secure. We never store your full card
                details.
              </InfoText>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoIcon>&#128231;</InfoIcon>
            <InfoContent>
              <InfoTitle>Receipt</InfoTitle>
              <InfoText>
                A receipt will be sent to your email address after the donation is processed.
              </InfoText>
            </InfoContent>
          </InfoCard>
        </SideSection>
      </ContentWrapper>
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(0.625rem); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f9fb 0%, #ffffff 100%);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  max-width: 80rem;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${({ theme }) => theme.colors.background.page};
    color: ${({ theme }) => theme.colors.primary.main};
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const BackIcon = styled.span`
  font-size: 1rem;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Step = styled.div<{ $active?: boolean; $completed?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ $active, $completed, theme }) =>
    $completed ? theme.colors.success : $active ? theme.colors.primary.main : 'white'};
  color: ${({ $active, $completed, theme }) =>
    $completed || $active ? 'white' : theme.colors.text.tertiary};
  border: 2px solid
    ${({ $active, $completed, theme }) =>
      $completed
        ? theme.colors.success
        : $active
          ? theme.colors.primary.main
          : theme.colors.border.light};
  transition: all 0.3s ease;
`;

const StepLine = styled.div<{ $completed?: boolean }>`
  width: 2rem;
  height: 2px;
  background: ${({ $completed, theme }) =>
    $completed ? theme.colors.success : theme.colors.border.light};
  transition: background 0.3s ease;
`;

const ContentWrapper = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  display: grid;
  grid-template-columns: 1fr 24rem;
  gap: 2.5rem;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 64rem) {
    grid-template-columns: 1fr;
  }
`;

const MainSection = styled.div``;

const FormCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const CardIcon = styled.span`
  font-size: 1.5rem;
`;

const FormTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Form = styled.form``;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  color: #dc2626;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const ErrorMessageIcon = styled.span`
  font-size: 1.25rem;
`;

const CardPreview = styled.div<{ $cardType: string | null }>`
  background: ${({ $cardType }) => {
    switch ($cardType) {
      case 'visa':
        return 'linear-gradient(135deg, #1a1f71 0%, #2b38a0 100%)';
      case 'mastercard':
        return 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)';
      case 'amex':
        return 'linear-gradient(135deg, #006fcf 0%, #00aef0 100%)';
      case 'discover':
        return 'linear-gradient(135deg, #ff6600 0%, #ffcc00 100%)';
      default:
        return 'linear-gradient(135deg, #374151 0%, #6b7280 100%)';
    }
  }};
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 3s infinite;
  }
`;

const CardPreviewNumber = styled.div`
  font-size: 1.25rem;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.15em;
  margin-bottom: 1.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const CardPreviewDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const CardPreviewName = styled.div`
  opacity: 0.9;
`;

const CardPreviewExpiry = styled.div`
  opacity: 0.9;
`;

const CardBrand = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  opacity: 0.8;
`;

const InputGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.75rem;
  overflow: hidden;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const InputIcon = styled.span`
  padding: 0 0.75rem 0 1rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem 1rem 1rem 0;
  border: none;
  font-size: 1rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const SecurityBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const BadgeIcon = styled.span`
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 160, 196, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const ButtonArrow = styled.span`
  font-size: 1.125rem;
  transition: transform 0.2s ease;

  ${SubmitButton}:hover:not(:disabled) & {
    transform: translateX(4px);
  }
`;

const SideSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 64rem) {
    order: -1;
  }
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

const SummaryIcon = styled.span`
  font-size: 1.5rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const SummaryContent = styled.div``;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`;

const SummaryLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SummaryValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SummaryBadge = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.success};
`;

const SummaryDivider = styled.hr`
  border: none;
  border-top: 1px dashed ${({ theme }) => theme.colors.border.light};
  margin: 0.75rem 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
`;

const TotalLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TotalValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
`;

const InfoIcon = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const InfoContent = styled.div``;

const InfoTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.25rem 0;
`;

const InfoText = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  background: linear-gradient(180deg, #f0f9fb 0%, #ffffff 100%);
`;

const ErrorIcon = styled.span`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorText = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: 1rem;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;

const PaymentOptionsSection = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.page};
  border-radius: 0.75rem;
`;

const SectionLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1rem 0;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const Checkbox = styled.div`
  position: relative;
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.75rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 2px 8px rgba(0, 160, 196, 0.1);
  }
`;

const CheckboxInput = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary.main};
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

const CheckboxLabel = styled.label`
  flex: 1;
  cursor: pointer;
`;

const CheckboxText = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const CheckboxSubtext = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const CheckboxIconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
`;

const RecurringDropdown = styled.select`
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 2px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const TransactionIdDisplay = styled.div`
  padding: 0.75rem 1rem;
  border: 1px dashed ${({ theme }) => theme.colors.border.light};
  border-radius: 0.5rem;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TransactionIdLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TransactionIdValue = styled.span`
  font-size: 0.8125rem;
  font-family: 'Courier New', monospace;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;
