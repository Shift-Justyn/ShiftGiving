import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getCampaignById } from '../api/campaigns';
import { CampaignDetail } from '../api/types';

const PRESET_AMOUNTS = [25, 50, 100, 250];

export const DonationPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getCampaignById(id);
      setCampaign(data as unknown as CampaignDetail);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (preset: number) => {
    setAmount(String(preset));
  };

  const handleContinue = () => {
    if (!amount || Number(amount) <= 0) return;
    navigate(`/campaigns/${id}/donate/payment`, {
      state: {
        amount: Number(amount),
        isAnonymous,
        message,
        campaignId: id,
        organizationId: campaign?.organization.id,
      },
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const calculateProgress = () => {
    if (!campaign) return 0;
    return Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>{t('common.loading')}</LoadingText>
      </LoadingContainer>
    );
  }

  if (!campaign) {
    return <ErrorContainer>{t('campaign.notFound')}</ErrorContainer>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(`/campaigns/${id}`)}>
          <BackIcon>&larr;</BackIcon>
          {t('common.back')}
        </BackButton>
        <StepIndicator>
          <Step $active>1</Step>
          <StepLine />
          <Step>2</Step>
          <StepLine />
          <Step>3</Step>
        </StepIndicator>
      </Header>

      <ContentWrapper>
        <MainSection>
          <CampaignHero>
            <HeroImage $hasImage={!!campaign.featuredImageUrl}>
              {campaign.featuredImageUrl ? (
                <img src={campaign.featuredImageUrl} alt={campaign.title || campaign.name} />
              ) : (
                <HeroPlaceholder>
                  <HeartIcon>&#9825;</HeartIcon>
                </HeroPlaceholder>
              )}
            </HeroImage>
            <HeroContent>
              <CampaignTitle>{campaign.title || campaign.name}</CampaignTitle>
              <OrgName>{campaign.organization?.name}</OrgName>
              <ProgressWrapper>
                <ProgressBar>
                  <ProgressFill $progress={calculateProgress()} />
                </ProgressBar>
                <ProgressStats>
                  <RaisedAmount>{formatCurrency(campaign.raisedAmount)}</RaisedAmount>
                  <GoalText>of {formatCurrency(campaign.goalAmount)} goal</GoalText>
                </ProgressStats>
              </ProgressWrapper>
            </HeroContent>
          </CampaignHero>

          <FormCard>
            <FormTitle>{t('donation.selectAmount')}</FormTitle>

            <AmountGrid>
              {PRESET_AMOUNTS.map((preset, index) => (
                <AmountButton
                  key={preset}
                  type="button"
                  $selected={amount === String(preset)}
                  $index={index}
                  onClick={() => handlePresetClick(preset)}
                >
                  <AmountValue>${preset}</AmountValue>
                </AmountButton>
              ))}
            </AmountGrid>

            <CustomAmountSection>
              <CustomAmountLabel>Or enter custom amount</CustomAmountLabel>
              <CustomAmountInput>
                <CurrencyPrefix>$</CurrencyPrefix>
                <AmountField
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                />
              </CustomAmountInput>
            </CustomAmountSection>

            <Divider />

            <OptionsSection>
              <OptionRow>
                <CustomCheckbox
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  aria-label="Make donation anonymous"
                />
                <CheckboxLabel htmlFor="anonymous">
                  <CheckboxBox $checked={isAnonymous}>
                    {isAnonymous && <CheckMark>&#10003;</CheckMark>}
                  </CheckboxBox>
                  <CheckboxText>
                    <CheckboxTitle>{t('donation.anonymous')}</CheckboxTitle>
                    <CheckboxDescription>Your name will not be shown publicly</CheckboxDescription>
                  </CheckboxText>
                </CheckboxLabel>
              </OptionRow>

              <MessageSection>
                <MessageLabel>{t('donation.addMessage')}</MessageLabel>
                <MessageField
                  placeholder="Share why you're supporting this cause..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </MessageSection>
            </OptionsSection>
          </FormCard>
        </MainSection>

        <SideSection>
          <SummaryCard>
            <SummaryHeader>
              <SummaryIcon>&#128176;</SummaryIcon>
              <SummaryTitle>{t('donation.summary')}</SummaryTitle>
            </SummaryHeader>

            <SummaryContent>
              <SummaryRow>
                <SummaryLabel>{t('donation.donationAmount')}</SummaryLabel>
                <SummaryValue $hasValue={!!amount}>
                  {amount ? formatCurrency(Number(amount)) : '$0.00'}
                </SummaryValue>
              </SummaryRow>
              <SummaryDivider />
              <SummaryRow $isTotal>
                <SummaryLabel>{t('donation.total')}</SummaryLabel>
                <TotalValue $hasValue={!!amount}>
                  {amount ? formatCurrency(Number(amount)) : '$0.00'}
                </TotalValue>
              </SummaryRow>
            </SummaryContent>

            <ContinueButton
              type="button"
              onClick={handleContinue}
              disabled={!amount || Number(amount) <= 0}
            >
              {t('donation.continueToPayment')}
              <ButtonArrow>&rarr;</ButtonArrow>
            </ContinueButton>

            <SecureNote>
              <LockIcon>&#128274;</LockIcon>
              Secure, encrypted donation
            </SecureNote>
          </SummaryCard>
        </SideSection>
      </ContentWrapper>
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(0.625rem); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
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

const Step = styled.div<{ $active?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary.main : 'white')};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.text.tertiary)};
  border: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary.main : theme.colors.border.light)};
  transition: all 0.3s ease;
`;

const StepLine = styled.div`
  width: 2rem;
  height: 2px;
  background: ${({ theme }) => theme.colors.border.light};
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

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CampaignHero = styled.div`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const HeroImage = styled.div<{ $hasImage: boolean }>`
  height: 12rem;
  background: ${({ $hasImage, theme }) =>
    $hasImage
      ? 'transparent'
      : `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.hover} 100%)`};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HeroPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeartIcon = styled.span`
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.3);
`;

const HeroContent = styled.div`
  padding: 1.5rem;
`;

const CampaignTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.25rem 0;
  font-family: 'Georgia', serif;
`;

const OrgName = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 1rem 0;
`;

const ProgressWrapper = styled.div``;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${({ theme }) => theme.colors.border.light};
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary.main} 0%, #00c4e4 100%);
  border-radius: 1rem;
  transition: width 0.5s ease;
`;

const ProgressStats = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const RaisedAmount = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.main};
`;

const GoalText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FormCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const FormTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1.25rem 0;
`;

const AmountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 32rem) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const AmountButton = styled.button<{ $selected: boolean; $index: number }>`
  padding: 1.25rem 1rem;
  border: 2px solid
    ${({ $selected, theme }) => ($selected ? theme.colors.primary.main : theme.colors.border.light)};
  border-radius: 0.75rem;
  background: ${({ $selected, theme }) => ($selected ? theme.colors.primary.light : 'white')};
  cursor: pointer;
  transition: all 0.2s ease;
  animation: ${fadeIn} 0.3s ease;
  animation-delay: ${({ $index }) => $index * 0.05}s;
  animation-fill-mode: both;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 160, 196, 0.15);
  }

  ${({ $selected }) =>
    $selected &&
    css`
      animation: ${pulse} 0.3s ease;
    `}
`;

const AmountValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CustomAmountSection = styled.div``;

const CustomAmountLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const CustomAmountInput = styled.div`
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

const CurrencyPrefix = styled.span`
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.background.page};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.125rem;
  font-weight: 600;
  border-right: 2px solid ${({ theme }) => theme.colors.border.light};
`;

const AmountField = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  background: white;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
    font-weight: 400;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  margin: 1.5rem 0;
`;

const OptionsSection = styled.div``;

const OptionRow = styled.div`
  margin-bottom: 1.5rem;
`;

const CustomCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
`;

const CheckboxBox = styled.div<{ $checked: boolean }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.375rem;
  border: 2px solid
    ${({ $checked, theme }) => ($checked ? theme.colors.primary.main : theme.colors.border.medium)};
  background: ${({ $checked, theme }) => ($checked ? theme.colors.primary.main : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
`;

const CheckMark = styled.span`
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
`;

const CheckboxText = styled.div``;

const CheckboxTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.125rem;
`;

const CheckboxDescription = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MessageSection = styled.div``;

const MessageLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const MessageField = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: none;
  background: white;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const SideSection = styled.div`
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
  position: sticky;
  top: 2rem;
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

const SummaryContent = styled.div`
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div<{ $isTotal?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ $isTotal }) => ($isTotal ? '0.75rem 0 0' : '0.5rem 0')};
`;

const SummaryLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SummaryValue = styled.span<{ $hasValue: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $hasValue, theme }) =>
    $hasValue ? theme.colors.text.primary : theme.colors.text.tertiary};
`;

const SummaryDivider = styled.hr`
  border: none;
  border-top: 1px dashed ${({ theme }) => theme.colors.border.light};
  margin: 0.75rem 0;
`;

const TotalValue = styled.span<{ $hasValue: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $hasValue, theme }) =>
    $hasValue ? theme.colors.text.primary : theme.colors.text.tertiary};
`;

const ContinueButton = styled.button`
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
  margin-bottom: 1rem;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 160, 196, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonArrow = styled.span`
  font-size: 1.125rem;
  transition: transform 0.2s ease;

  ${ContinueButton}:hover:not(:disabled) & {
    transform: translateX(4px);
  }
`;

const SecureNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const LockIcon = styled.span`
  font-size: 0.875rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  background: linear-gradient(180deg, #f0f9fb 0%, #ffffff 100%);
`;

const LoadingSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 3px solid ${({ theme }) => theme.colors.border.light};
  border-top-color: ${({ theme }) => theme.colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.error};
  background: linear-gradient(180deg, #f0f9fb 0%, #ffffff 100%);
`;
