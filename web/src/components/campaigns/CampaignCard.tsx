import styled from 'styled-components';
import { Campaign } from '../../api/types';
import { MapPin, BookOpen, ArrowRight, Heart } from 'lucide-react';
import { useState } from 'react';
import { ShiftGivingLogo } from '../common/ShiftGivingLogo';

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
}

const categoryColors: Record<string, string> = {
  Education: '#3B82F6',
  Health: '#EF4444',
  Environment: '#22C55E',
  Animals: '#F97316',
  Community: '#8B5CF6',
  Arts: '#EC4899',
};

const Card = styled.div<{ $clickable?: boolean }>`
  width: 100%;
  max-width: 22rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow:
    0 0.25rem 1rem rgba(0, 0, 0, 0.1),
    0 0.125rem 0.25rem rgba(0, 0, 0, 0.06);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};

  &:hover {
    transform: ${(props) => (props.$clickable ? 'translateY(-0.375rem)' : 'none')};
    box-shadow: ${(props) =>
      props.$clickable
        ? '0 1.25rem 2.5rem rgba(0, 160, 196, 0.2), 0 0.5rem 1rem rgba(0, 0, 0, 0.12)'
        : '0 0.25rem 1rem rgba(0, 0, 0, 0.1), 0 0.125rem 0.25rem rgba(0, 0, 0, 0.06)'};
  }

  @media (min-width: 48rem) {
    width: 100%;
    max-width: none;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 12.5rem;
  overflow: hidden;
`;

const Image = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.$imageUrl
      ? `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%), url(${props.$imageUrl})`
      : props.theme.colors.border.light};
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const CategoryBadge = styled.div<{ $color: string }>`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  color: ${(props) => props.$color};
  backdrop-filter: blur(0.5rem);
  padding: 0.375rem 0.75rem;
  border-radius: 1.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
`;

const HeartButton = styled.button<{ $liked: boolean }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.9);
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const Content = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  line-height: 1.4;
  min-height: 3.15rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Description = styled.p`
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 1.5;
  min-height: 2.625rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const LocationText = styled.div<{ $visible?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  margin-bottom: 0.75rem;
  min-height: 1.125rem;
  visibility: ${(props) => (props.$visible === false ? 'hidden' : 'visible')};

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const ReadStoryLink = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  color: #00a0c4;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #008ca8;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const ProgressSection = styled.div`
  margin-top: auto;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 0.0625rem solid ${(props) => props.theme.colors.border.light};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ProgressLabel = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.secondary};
  font-weight: 600;
`;

const ProgressPercentage = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: 700;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${(props) => props.theme.colors.border.light};
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background: #00a0c4;
  transition: width 0.3s ease;
`;

const MetricsRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
`;

const MetricItem = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};

  strong {
    color: ${(props) => props.theme.colors.text.primary};
    font-weight: 600;
  }
`;

const ImpactMetrics = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #00a0c4;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 160, 196, 0.08);
  border-radius: 0.375rem;
  margin-top: 0.5rem;

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const DonateButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 0.125rem solid #00a0c4;
  border-radius: 0.5rem;
  color: #00a0c4;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #00a0c4;
    color: #ffffff;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const calculateProgress = (raised: number, goal: number): number => {
  return Math.min((raised / goal) * 100, 100);
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const calculateFamiliesHelped = (raisedAmount: number): number => {
  return Math.floor(raisedAmount / 100);
};

export const CampaignCard = ({ campaign, onClick }: CampaignCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const progressPercentage = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
  const categoryColor = campaign.category ? categoryColors[campaign.category] : '#6B7280';
  const familiesHelped = calculateFamiliesHelped(campaign.raisedAmount);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleStoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card $clickable={!!onClick} onClick={onClick}>
      <ImageContainer>
        <Image $imageUrl={campaign.featuredImageUrl || undefined} />
        {campaign.category && (
          <CategoryBadge $color={categoryColor}>{campaign.category}</CategoryBadge>
        )}
        <HeartButton $liked={isLiked} onClick={handleHeartClick}>
          <ShiftGivingLogo
            size={18}
            color={isLiked ? '#EF4444' : '#00A0C4'}
            backColor={isLiked ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 160, 196, 0.3)'}
          />
        </HeartButton>
      </ImageContainer>
      <Content>
        <Title>{campaign.title}</Title>
        <Description>{campaign.shortDescription}</Description>
        <LocationText $visible={!!campaign.location}>
          <MapPin />
          {campaign.location || '\u00A0'}
        </LocationText>
        <ReadStoryLink onClick={handleStoryClick}>
          <BookOpen />
          Read Full Story
        </ReadStoryLink>
        <ProgressSection>
          <ProgressHeader>
            <ProgressLabel>Funding Progress</ProgressLabel>
            <ProgressPercentage>{Math.round(progressPercentage)}%</ProgressPercentage>
          </ProgressHeader>
          <ProgressBar>
            <ProgressFill $percentage={progressPercentage} />
          </ProgressBar>
          <MetricsRow>
            <MetricItem>
              Goal: <strong>{formatCurrency(campaign.goalAmount)}</strong>
            </MetricItem>
            <MetricItem>
              Raised: <strong>{formatCurrency(campaign.raisedAmount)}</strong>
            </MetricItem>
          </MetricsRow>
          <ImpactMetrics>
            <Heart />
            Families Helped: {familiesHelped}
          </ImpactMetrics>
        </ProgressSection>
        <DonateButton onClick={(e) => e.stopPropagation()}>
          Donate Now
          <ArrowRight />
        </DonateButton>
      </Content>
    </Card>
  );
};
