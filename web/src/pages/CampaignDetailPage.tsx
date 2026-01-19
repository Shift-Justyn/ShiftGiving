import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getCampaignById } from '../api/campaigns';
import { CampaignDetail } from '../api/types';
import { BottomNavigation } from '../components/navigation/BottomNavigation';

export const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaignData();
  }, [id]);

  const loadCampaignData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const campaignData = await getCampaignById(id);
      setCampaign(campaignData as unknown as CampaignDetail);
    } catch {
      setError('Failed to load campaign details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusLabel = (status: string, endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (status.toLowerCase() === 'completed' || daysLeft <= 0) {
      return t('campaign.ended');
    }
    if (daysLeft <= 7) {
      return 'Closing Soon!';
    }
    return `${daysLeft} ${t('campaign.daysLeft')}`;
  };

  if (loading) {
    return <LoadingContainer>{t('common.loading')}</LoadingContainer>;
  }

  if (error || !campaign) {
    return <ErrorContainer>{error || t('campaign.notFound')}</ErrorContainer>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </BackButton>
        <SearchButton>
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
        </SearchButton>
      </Header>

      <HeroSection>
        {campaign.featuredImageUrl ? (
          <HeroImage $imageUrl={campaign.featuredImageUrl} />
        ) : (
          <HeroPlaceholder />
        )}
        <PlayButton>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </PlayButton>
      </HeroSection>

      <ContentSection>
        <CampaignTitle>{campaign.title}</CampaignTitle>

        <MetaRow>
          <StatusBadge
            $isClosingSoon={getStatusLabel(campaign.status, campaign.endDate).includes('Closing')}
          >
            {getStatusLabel(campaign.status, campaign.endDate)}
          </StatusBadge>
          <GoalAmount>{formatCurrency(campaign.goalAmount)}</GoalAmount>
        </MetaRow>

        <Description>{campaign.description}</Description>

        <SocialSection>
          <SocialIcon href="#" aria-label="Share on Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="#" aria-label="Share on X">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="#" aria-label="Share on Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="#" aria-label="Share on LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </SocialIcon>
        </SocialSection>
      </ContentSection>

      <DonateButtonContainer>
        <DonateButton onClick={() => navigate(`/campaigns/${id}/donate`)}>
          {t('campaign.donate')}
        </DonateButton>
      </DonateButtonContainer>

      <BottomNavigation />
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background.page};
  padding-bottom: 8rem;

  @media (min-width: 48rem) {
    padding-bottom: 2rem;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const BackButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.background.card};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const SearchButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.background.card};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  height: 16rem;

  @media (min-width: 48rem) {
    height: 24rem;
  }
`;

const HeroImage = styled.div<{ $imageUrl: string }>`
  width: 100%;
  height: 100%;
  background: url(${(props) => props.$imageUrl});
  background-size: cover;
  background-position: center;
`;

const HeroPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main} 0%,
    ${(props) => props.theme.colors.primary.hover} 100%
  );
`;

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${(props) => props.theme.colors.primary.main};
    margin-left: 0.25rem;
  }

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const ContentSection = styled.div`
  padding: 1.5rem;

  @media (min-width: 48rem) {
    max-width: 48rem;
    margin: 0 auto;
    padding: 2rem;
  }
`;

const CampaignTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 1rem 0;
  line-height: 1.3;

  @media (min-width: 48rem) {
    font-size: 2rem;
  }
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StatusBadge = styled.span<{ $isClosingSoon?: boolean }>`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) =>
    props.$isClosingSoon ? props.theme.colors.primary.main : props.theme.colors.border.light};
  color: ${(props) =>
    props.$isClosingSoon ? props.theme.colors.text.inverse : props.theme.colors.text.secondary};
`;

const GoalAmount = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
`;

const Description = styled.div`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 2rem;

  @media (min-width: 48rem) {
    font-size: 1rem;
  }
`;

const SocialSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${(props) => props.theme.colors.border.light};
`;

const SocialIcon = styled.a`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text.primary};
  transition: color 0.2s;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const DonateButtonContainer = styled.div`
  position: fixed;
  bottom: 4.5rem;
  left: 1rem;
  right: 1rem;
  z-index: 50;

  @media (min-width: 48rem) {
    position: static;
    max-width: 48rem;
    margin: 0 auto;
    padding: 0 2rem;
  }
`;

const DonateButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${(props) => props.theme.colors.primary.main};
  color: ${(props) => props.theme.colors.text.inverse};
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.primary.hover};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.error};
`;
