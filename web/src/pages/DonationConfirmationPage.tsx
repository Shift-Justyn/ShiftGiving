import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getDonationById } from '../api/donations';
import { Donation } from '../api/types';

export const DonationConfirmationPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonation();
  }, [id]);

  const loadDonation = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getDonationById(id);
      setDonation(data);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>{t('common.loading')}</LoadingText>
      </LoadingContainer>
    );
  }

  if (!donation) {
    return <ErrorContainer>{t('common.error')}</ErrorContainer>;
  }

  return (
    <Container>
      <Header>
        <StepIndicator>
          <Step $completed>&#10003;</Step>
          <StepLine $completed />
          <Step $completed>&#10003;</Step>
          <StepLine $completed />
          <Step $completed>&#10003;</Step>
        </StepIndicator>
      </Header>

      <ContentWrapper>
        <SuccessCard>
          <ConfettiContainer>
            {[...Array(20)].map((_, i) => (
              <Confetti key={i} $delay={i * 0.1} $left={Math.random() * 100} />
            ))}
          </ConfettiContainer>

          <SuccessIconWrapper>
            <SuccessIcon>
              <CheckMark>&#10003;</CheckMark>
            </SuccessIcon>
            <PulseRing />
          </SuccessIconWrapper>

          <Title>{t('donation.success')}</Title>
          <Subtitle>{t('donation.successMessage')}</Subtitle>

          <AmountDisplay>
            <AmountLabel>Your donation</AmountLabel>
            <AmountValue>{formatCurrency(donation.amount)}</AmountValue>
          </AmountDisplay>

          <DetailsCard>
            <DetailRow>
              <DetailIcon>&#128197;</DetailIcon>
              <DetailContent>
                <DetailLabel>Date</DetailLabel>
                <DetailValue>{formatDate(donation.createdAt)}</DetailValue>
              </DetailContent>
            </DetailRow>

            <DetailRow>
              <DetailIcon>&#128196;</DetailIcon>
              <DetailContent>
                <DetailLabel>{t('donation.donationId')}</DetailLabel>
                <DetailValue $mono>{donation.id.substring(0, 8).toUpperCase()}</DetailValue>
              </DetailContent>
            </DetailRow>

            <DetailRow>
              <DetailIcon>&#128179;</DetailIcon>
              <DetailContent>
                <DetailLabel>Payment Method</DetailLabel>
                <DetailValue>Credit Card</DetailValue>
              </DetailContent>
            </DetailRow>

            {donation.donorMessage && (
              <MessageRow>
                <MessageIcon>&#128172;</MessageIcon>
                <MessageContent>
                  <MessageLabel>Your message</MessageLabel>
                  <MessageText>{donation.donorMessage}</MessageText>
                </MessageContent>
              </MessageRow>
            )}
          </DetailsCard>

          <ActionsSection>
            <PrimaryLink to="/">{t('donation.backToCampaigns')}</PrimaryLink>
          </ActionsSection>

          <ShareSection>
            <ShareText>Share your support</ShareText>
            <ShareButtons>
              <ShareButton $platform="twitter">
                <span>&#128038;</span>
              </ShareButton>
              <ShareButton $platform="facebook">
                <span>f</span>
              </ShareButton>
              <ShareButton $platform="linkedin">
                <span>in</span>
              </ShareButton>
            </ShareButtons>
          </ShareSection>
        </SuccessCard>

        <ThankYouNote>
          <NoteIcon>&#128150;</NoteIcon>
          <NoteText>
            Your generosity makes a real difference. Thank you for being part of our community.
          </NoteText>
        </ThankYouNote>
      </ContentWrapper>
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
`;

const fall = keyframes`
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #e8f8fb 0%, #ffffff 50%, #f0f9fb 100%);
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Step = styled.div<{ $completed?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.success};
  color: white;
  border: 2px solid ${({ theme }) => theme.colors.success};
`;

const StepLine = styled.div<{ $completed?: boolean }>`
  width: 2rem;
  height: 2px;
  background: ${({ theme }) => theme.colors.success};
`;

const ContentWrapper = styled.div`
  max-width: 32rem;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  animation: ${fadeIn} 0.6s ease;
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const ConfettiContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const Confetti = styled.div<{ $delay: number; $left: number }>`
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  background: ${() => {
    const colors = ['#00a0c4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }};
  left: ${({ $left }) => $left}%;
  animation: ${fall} 3s ease-in forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  border-radius: 2px;
`;

const SuccessIconWrapper = styled.div`
  position: relative;
  width: 6rem;
  height: 6rem;
  margin: 0 auto 1.5rem;
`;

const SuccessIcon = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${scaleIn} 0.5s ease;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
`;

const PulseRing = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid ${({ theme }) => theme.colors.success};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-out;
`;

const CheckMark = styled.span`
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
  font-family: 'Georgia', serif;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 2rem 0;
`;

const AmountDisplay = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.light} 0%,
    #e8f8fb 100%
  );
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const AmountLabel = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 0.25rem 0;
`;

const AmountValue = styled.p`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.main};
  margin: 0;
`;

const DetailsCard = styled.div`
  background: ${({ theme }) => theme.colors.background.page};
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }
`;

const DetailIcon = styled.span`
  font-size: 1.25rem;
  width: 2rem;
  text-align: center;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 0.125rem 0;
`;

const DetailValue = styled.p<{ $mono?: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  font-family: ${({ $mono }) => ($mono ? "'Courier New', monospace" : 'inherit')};
`;

const MessageRow = styled(DetailRow)`
  align-items: flex-start;
  padding-top: 1rem;
`;

const MessageIcon = styled(DetailIcon)``;

const MessageContent = styled(DetailContent)``;

const MessageLabel = styled(DetailLabel)``;

const MessageText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  font-style: italic;
  line-height: 1.5;
`;

const ActionsSection = styled.div`
  margin-bottom: 1.5rem;
`;

const PrimaryLink = styled(Link)`
  display: inline-block;
  padding: 1rem 2.5rem;
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 160, 196, 0.3);
  }
`;

const ShareSection = styled.div`
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const ShareText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 1rem 0;
`;

const ShareButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
`;

const ShareButton = styled.button<{ $platform: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.2s ease;
  background: ${({ $platform }) => {
    switch ($platform) {
      case 'twitter':
        return '#1da1f2';
      case 'facebook':
        return '#4267b2';
      case 'linkedin':
        return '#0077b5';
      default:
        return '#6b7280';
    }
  }};
  color: white;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const ThankYouNote = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease 0.3s both;
`;

const NoteIcon = styled.span`
  font-size: 2rem;
`;

const NoteText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
  text-align: left;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  background: linear-gradient(180deg, #e8f8fb 0%, #ffffff 100%);
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
  background: linear-gradient(180deg, #e8f8fb 0%, #ffffff 100%);
`;
