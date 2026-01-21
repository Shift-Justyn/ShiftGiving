import styled, { keyframes, css } from 'styled-components';
import { Campaign, MediaGalleryItem } from '../../api/types';
import {
  MapPin,
  BookOpen,
  ShoppingBasket,
  X,
  ChevronUp,
  Plus,
  Minus,
  ArrowRight,
  Play,
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { GivingAppLogo } from '../common/ShiftGivingLogo';
import { createPortal } from 'react-dom';

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
  onAddToBasket?: (campaign: Campaign, amount: number) => void;
}

const categoryColors: Record<string, string> = {
  Education: '#3B82F6',
  Health: '#EF4444',
  Environment: '#22C55E',
  Animals: '#F97316',
  Community: '#8B5CF6',
  Arts: '#EC4899',
};

const CAMPAIGN_VIDEOS: Record<string, string> = {
  'Kelp Forest Restoration': '/images/campaigns/kelp/kelp-forest-main.gif',
  'Amazon Rainforest Conservation': '/images/campaigns/amazon/amazon-main.gif',
};

const bounceIn = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  75% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
`;

const Card = styled.div<{ $expanded?: boolean; $isExpanding?: boolean }>`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow:
    0 0.25rem 1rem rgba(0, 0, 0, 0.1),
    0 0.125rem 0.25rem rgba(0, 0, 0, 0.06);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.3s ease;
  cursor: ${(props) => (props.$expanded ? 'default' : 'pointer')};
  border: 0.125rem solid ${(props) => (props.$expanded ? '#00a0c4' : 'transparent')};

  ${(props) =>
    props.$isExpanding &&
    css`
      animation: ${bounceIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `}

  &:hover {
    transform: ${(props) => (props.$expanded ? 'none' : 'translateY(-0.5rem)')};
    box-shadow:
      0 1.25rem 2.5rem rgba(0, 160, 196, 0.2),
      0 0.5rem 1rem rgba(0, 0, 0, 0.12);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 12rem;
  overflow: hidden;
  border-radius: 0.75rem 0.75rem 0 0;
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

const BadgeContainer = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: flex;
  gap: 0.375rem;
`;

const CategoryBadge = styled.div<{ $color: string }>`
  background: rgba(255, 255, 255, 0.9);
  color: ${(props) => props.$color};
  backdrop-filter: blur(0.5rem);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.625rem;
  font-weight: 600;
  border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
`;

const LimitedAvailabilityBadge = styled.div`
  background: rgba(239, 68, 68, 0.95);
  color: #ffffff;
  backdrop-filter: blur(0.5rem);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.625rem;
  font-weight: 700;
  border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.85;
    }
  }
`;

const VideoPlayIndicator = styled.div`
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: all 0.2s ease;

  svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.125rem;
  }
`;

const VideoPlayingBadge = styled.div`
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(34, 197, 94, 0.9);
  color: #ffffff;
  backdrop-filter: blur(0.5rem);
  padding: 0.25rem 0.625rem;
  border-radius: 1rem;
  font-size: 0.625rem;
  font-weight: 600;
  border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const VideoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const HeartButton = styled.button<{ $liked: boolean }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
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
    background: #ffffff;
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.25rem;
  color: #00a0c4;
  transition: all 0.2s ease;
  margin-left: auto;

  &:hover {
    color: #008ca8;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
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

const Description = styled.p<{ $expanded?: boolean }>`
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 1.5;
  display: ${(props) => (props.$expanded ? 'block' : '-webkit-box')};
  -webkit-line-clamp: ${(props) => (props.$expanded ? 'none' : '2')};
  -webkit-box-orient: vertical;
  overflow: ${(props) => (props.$expanded ? 'visible' : 'hidden')};
  min-height: ${(props) => (props.$expanded ? 'auto' : '2.625rem')};
`;

const LocationText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  margin-bottom: 0.75rem;

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const StoryRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReadStoryLink = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  color: #00a0c4;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
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

const LearnMoreButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #00a0c4;
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto;

  &:hover {
    background: #008ca8;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const ExpandedSection = styled.div`
  padding: 1rem 1.25rem 1.25rem;
  border-top: 0.0625rem solid ${(props) => props.theme.colors.border.light};
  background: ${(props) => props.theme.colors.background.page};
`;

const ExpandedTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const ExpandedDescription = styled.p`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  margin: 0 0 1rem 0;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const QuantityButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: 0.0625rem solid ${(props) => props.theme.colors.border.light};
  background: ${(props) => props.theme.colors.background.card};
  color: ${(props) => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #00a0c4;
    color: #00a0c4;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const QuantityInput = styled.input`
  flex: 1;
  height: 2rem;
  border-radius: 0.375rem;
  border: 0.0625rem solid ${(props) => props.theme.colors.border.light};
  background: ${(props) => props.theme.colors.background.card};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 0.875rem;
  text-align: center;
  outline: none;

  &:focus {
    border-color: #00a0c4;
  }
`;

const CostSummary = styled.div`
  background: rgba(0, 160, 196, 0.08);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
`;

const CostRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 0.25rem;

  &:last-child {
    margin-bottom: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.625rem;
  background: transparent;
  border: 0.0625rem solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.text.tertiary};
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 0.625rem;
  background: #00a0c4;
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #008ca8;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

// Dialog styles using Portal
const DialogOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const DialogContent = styled.div`
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 0.75rem;
  max-width: 56rem;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.3);
`;

const DialogHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(135deg, #00a0c4 0%, #0077b6 50%, #005f8a 100%);
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow:
    0 0.25rem 1rem rgba(0, 119, 182, 0.3),
    0 0.125rem 0.5rem rgba(0, 0, 0, 0.15);
`;

const DialogTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  padding-right: 2rem;
  text-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #ffffff;
  transition: all 0.2s ease;
  border-radius: 50%;
  backdrop-filter: blur(0.25rem);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const DialogScrollContent = styled.div`
  overflow-y: auto;
  max-height: calc(90vh - 6rem);
  padding: 1.5rem;
`;

const GallerySection = styled.div`
  margin-bottom: 2rem;
`;

const GallerySectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 1rem 0;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 48rem) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MediaItem = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 0.5rem;
  background: ${(props) => props.theme.colors.border.light};
`;

const MediaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const MediaCaption = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  text-align: center;
  margin: 0.5rem 0 0 0;
`;

const StorySection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 0.0625rem solid ${(props) => props.theme.colors.border.light};
`;

const StorySectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 1rem 0;
`;

const StoryText = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: ${(props) => props.theme.colors.text.secondary};
  white-space: pre-line;
  margin: 0;
`;

const calculateProgress = (raised: number, goal: number): number => {
  return Math.min((raised / goal) * 100, 100);
};

const formatCurrency = (amount: number): string => {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
};

const calculateImpactCount = (raisedAmount: number): number => {
  return Math.floor(raisedAmount / 100);
};

const _PRESET_AMOUNTS = [25, 50, 100, 250];

const DEFAULT_MEDIA_GALLERY: MediaGalleryItem[] = [
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=450&fit=crop',
    caption: 'Community members gathering',
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=450&fit=crop',
    caption: 'Making an impact together',
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=450&fit=crop',
    caption: 'Local outreach program',
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=450&fit=crop',
    caption: 'Building a better future',
  },
];

const DEFAULT_STORY = `This campaign represents our commitment to making a meaningful difference in the lives of those we serve. Through the generous support of donors like you, we have been able to expand our reach and deepen our impact.

Our team works tirelessly to ensure that every dollar donated goes directly toward supporting our mission. We believe in transparency and accountability, which is why we provide regular updates on how your contributions are being used.

Together, we can create lasting change. Your support enables us to continue this important work and reach even more people in need. Thank you for being part of our community and for believing in our mission.`;

export const CampaignCard = ({ campaign, onClick: _onClick, onAddToBasket }: CampaignCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const progressPercentage = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
  const categoryColor = campaign.category ? categoryColors[campaign.category] : '#6B7280';
  const impactCount = calculateImpactCount(campaign.raisedAmount);
  const impactLabel = campaign.impactLabel || 'Families Helped';
  const isLimitedAvailability = campaign.fundingPercentage && campaign.fundingPercentage >= 90;

  const mediaGallery = campaign.mediaGallery || DEFAULT_MEDIA_GALLERY;
  const unitLabel = campaign.unitLabel || 'Donation';
  const pricePerUnit = campaign.unitPrice || 50;
  const totalCost = quantity * pricePerUnit;
  const storyContent = campaign.storyContent || DEFAULT_STORY;

  const handleCardClick = useCallback(() => {
    if (!isExpanded) {
      setIsExpanding(true);
      setIsExpanded(true);
      setTimeout(() => setIsExpanding(false), 400);
    }
  }, [isExpanded]);

  const handleCollapseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    setQuantity(1);
  }, []);

  const handleHeartClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  }, []);

  const handleStoryClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStoryOpen(true);
  }, []);

  const handleCloseStory = useCallback(() => {
    setIsStoryOpen(false);
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleCloseStory();
      }
    },
    [handleCloseStory]
  );

  const adjustQuantity = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  }, []);

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseInt(e.target.value, 10) || 1;
    setQuantity(Math.max(1, val));
  }, []);

  const handleAddToBasket = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onAddToBasket) {
        onAddToBasket(campaign, totalCost);
        setIsExpanded(false);
        setQuantity(1);
      }
    },
    [campaign, totalCost, onAddToBasket]
  );

  const handleCancelClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    setQuantity(1);
  }, []);

  return (
    <>
      <Card $expanded={isExpanded} $isExpanding={isExpanding} onClick={handleCardClick}>
        <ImageContainer>
          {isExpanded && CAMPAIGN_VIDEOS[campaign.title] ? (
            <VideoImage src={CAMPAIGN_VIDEOS[campaign.title]} alt={`${campaign.title} video`} />
          ) : (
            <Image $imageUrl={campaign.featuredImageUrl || undefined} />
          )}
          <BadgeContainer>
            {campaign.category && (
              <CategoryBadge $color={categoryColor}>{campaign.category}</CategoryBadge>
            )}
            {isLimitedAvailability && (
              <LimitedAvailabilityBadge>Limited Availability</LimitedAvailabilityBadge>
            )}
          </BadgeContainer>
          <HeartButton $liked={isLiked} onClick={handleHeartClick}>
            <GivingAppLogo
              size={18}
              color={isLiked ? '#EF4444' : '#00A0C4'}
              backColor={isLiked ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 160, 196, 0.3)'}
            />
          </HeartButton>
          {CAMPAIGN_VIDEOS[campaign.title] && !isExpanded && (
            <VideoPlayIndicator>
              <Play />
            </VideoPlayIndicator>
          )}
          {CAMPAIGN_VIDEOS[campaign.title] && isExpanded && (
            <VideoPlayingBadge>Video Playing</VideoPlayingBadge>
          )}
        </ImageContainer>
        <Content>
          <Title>{campaign.title}</Title>
          <Description $expanded={isExpanded}>{campaign.shortDescription}</Description>
          {campaign.location && (
            <LocationText>
              <MapPin />
              {campaign.location}
            </LocationText>
          )}
          <StoryRow>
            <ReadStoryLink onClick={handleStoryClick}>
              <BookOpen />
              Read Full Story
            </ReadStoryLink>
            {isExpanded && (
              <CollapseButton onClick={handleCollapseClick}>
                <ChevronUp />
              </CollapseButton>
            )}
          </StoryRow>
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
            {campaign.unitLabel && (
              <MetricsRow>
                <MetricItem>
                  Unit: <strong>{unitLabel}</strong>
                </MetricItem>
                <MetricItem>
                  Price:{' '}
                  <strong>
                    {formatCurrency(pricePerUnit)} per {unitLabel}
                  </strong>
                </MetricItem>
              </MetricsRow>
            )}
            <ImpactMetrics>
              <GivingAppLogo size={14} color="#00a0c4" backColor="rgba(0, 160, 196, 0.3)" />
              {impactLabel}: {impactCount.toLocaleString()}
            </ImpactMetrics>
          </ProgressSection>

          {!isExpanded && (
            <LearnMoreButton onClick={handleCardClick}>
              Learn More
              <ArrowRight />
            </LearnMoreButton>
          )}
        </Content>

        {isExpanded && (
          <ExpandedSection onClick={(e) => e.stopPropagation()}>
            <ExpandedTitle>Add Donation to Basket</ExpandedTitle>
            <ExpandedDescription>Select an amount to support this campaign.</ExpandedDescription>

            <QuantitySelector>
              <QuantityButton onClick={() => adjustQuantity(-1)}>
                <Minus />
              </QuantityButton>
              <QuantityInput
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                onClick={(e) => e.stopPropagation()}
              />
              <QuantityButton onClick={() => adjustQuantity(1)}>
                <Plus />
              </QuantityButton>
            </QuantitySelector>

            <CostSummary>
              <CostRow>
                <span>{unitLabel}:</span>
                <span>{quantity}</span>
              </CostRow>
              <CostRow>
                <span>Price:</span>
                <span>{formatCurrency(pricePerUnit)} each</span>
              </CostRow>
              <CostRow>
                <span>Total:</span>
                <span style={{ color: '#00a0c4' }}>{formatCurrency(totalCost)}</span>
              </CostRow>
            </CostSummary>

            <ButtonRow>
              <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
              <ConfirmButton onClick={handleAddToBasket}>
                <ShoppingBasket />
                Add to Basket
              </ConfirmButton>
            </ButtonRow>
          </ExpandedSection>
        )}
      </Card>

      {isStoryOpen &&
        createPortal(
          <DialogOverlay onClick={handleOverlayClick}>
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>{campaign.title}</DialogTitle>
                <CloseButton onClick={handleCloseStory}>
                  <X />
                </CloseButton>
              </DialogHeader>
              <DialogScrollContent>
                <GallerySection>
                  <GallerySectionTitle>Campaign Gallery</GallerySectionTitle>
                  <MediaGrid>
                    {mediaGallery.slice(0, 4).map((media, index) => (
                      <div key={index}>
                        <MediaItem>
                          <MediaImage
                            src={media.url}
                            alt={media.caption || `Campaign media ${index + 1}`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=450&fit=crop`;
                            }}
                          />
                        </MediaItem>
                        {media.caption && <MediaCaption>{media.caption}</MediaCaption>}
                      </div>
                    ))}
                  </MediaGrid>
                </GallerySection>
                <StorySection>
                  <StorySectionTitle>Campaign Story</StorySectionTitle>
                  <StoryText>{storyContent}</StoryText>
                </StorySection>
              </DialogScrollContent>
            </DialogContent>
          </DialogOverlay>,
          document.body
        )}
    </>
  );
};
