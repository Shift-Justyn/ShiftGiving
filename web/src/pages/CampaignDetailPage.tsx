import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getCampaignById } from '../api/campaigns';
import { CampaignDetail } from '../api/types';

export const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const calculateProgress = () => {
    if (!campaign) return 0;
    return Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoadingContainer>Loading campaign details...</LoadingContainer>;
  }

  if (error || !campaign) {
    return <ErrorContainer>{error || 'Campaign not found'}</ErrorContainer>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>← Back to Campaigns</BackButton>

      <HeroSection>
        <HeroPlaceholder>Campaign Image</HeroPlaceholder>
      </HeroSection>

      <ContentSection>
        <MainContent>
          <CampaignTitle>{campaign.title}</CampaignTitle>

          {campaign.organization && (
            <OrganizationInfo>
              <OrgLogo>
                {campaign.organization.logoUrl ? (
                  <img src={campaign.organization.logoUrl} alt={campaign.organization.name} />
                ) : (
                  <LogoPlaceholder>{campaign.organization.name.charAt(0)}</LogoPlaceholder>
                )}
              </OrgLogo>
              <OrgDetails>
                <OrgName>{campaign.organization.name}</OrgName>
              </OrgDetails>
            </OrganizationInfo>
          )}

          <ProgressSection>
            <ProgressHeader>
              <RaisedAmount>{formatCurrency(campaign.raisedAmount)}</RaisedAmount>
              <GoalAmount>raised of {formatCurrency(campaign.goalAmount)} goal</GoalAmount>
            </ProgressHeader>
            <ProgressBar>
              <ProgressFill $progress={calculateProgress()} />
            </ProgressBar>
            <ProgressPercentage>{calculateProgress().toFixed(0)}% funded</ProgressPercentage>
          </ProgressSection>

          <Description>{campaign.description}</Description>

          <DatesSection>
            <DateItem>
              <DateLabel>Start Date</DateLabel>
              <DateValue>{formatDate(campaign.startDate)}</DateValue>
            </DateItem>
            <DateItem>
              <DateLabel>End Date</DateLabel>
              <DateValue>{formatDate(campaign.endDate)}</DateValue>
            </DateItem>
          </DatesSection>

          <StatusBadge $status={campaign.status}>{campaign.status}</StatusBadge>
        </MainContent>

        <Sidebar>
          <DonateButton onClick={() => navigate(`/campaigns/${id}/donate`)}>
            Donate Now
          </DonateButton>

          {campaign.organization && (
            <OrgCard>
              <OrgCardTitle>About the Organization</OrgCardTitle>
              <OrgCardDescription>{campaign.organization.description}</OrgCardDescription>
            </OrgCard>
          )}
        </Sidebar>
      </ContentSection>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const BackButton = styled.button`
  margin: 1rem 2rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: #00a0c4;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const HeroSection = styled.div`
  width: 100%;
  height: 25rem;
  background: linear-gradient(135deg, #00a0c4 0%, #0077a3 100%);
`;

const HeroPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
`;

const ContentSection = styled.div`
  max-width: 75rem;
  margin: -4rem auto 0;
  padding: 0 2rem 4rem;
  display: grid;
  grid-template-columns: 1fr 22rem;
  gap: 2rem;

  @media (max-width: 64rem) {
    grid-template-columns: 1fr;
    margin-top: -2rem;
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CampaignTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
`;

const OrganizationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const OrgLogo = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LogoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: #00a0c4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
`;

const OrgDetails = styled.div`
  flex: 1;
`;

const OrgName = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const ProgressSection = styled.div`
  margin-bottom: 2rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const RaisedAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #00a0c4;
`;

const GoalAmount = styled.div`
  font-size: 1rem;
  color: #6b7280;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.75rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #00a0c4 0%, #00c4e4 100%);
  width: ${(props) => props.$progress}%;
  transition: width 0.3s ease;
`;

const ProgressPercentage = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.75;
  color: #4b5563;
  margin-bottom: 2rem;
`;

const DatesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 32rem) {
    grid-template-columns: 1fr;
  }
`;

const DateItem = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
`;

const DateLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const DateValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
  background-color: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case 'active':
        return '#d1fae5';
      case 'completed':
        return '#dbeafe';
      case 'pending':
        return '#fef3c7';
      default:
        return '#e5e7eb';
    }
  }};
  color: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case 'active':
        return '#065f46';
      case 'completed':
        return '#1e40af';
      case 'pending':
        return '#92400e';
      default:
        return '#1f2937';
    }
  }};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 64rem) {
    margin-top: 2rem;
  }
`;

const DonateButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-0.125rem);
  }
`;

const OrgCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const OrgCardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const OrgCardDescription = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.25rem;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.25rem;
  color: #dc2626;
`;
