import { useCallback } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ShoppingBasket, ArrowRight } from 'lucide-react';
import { Campaign } from '../../api/types';
import { useNavigate } from 'react-router-dom';

interface CampaignMapModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  onAddToBasket?: (campaign: Campaign, amount: number, quantity: number) => void;
}

const categoryColors: Record<string, string> = {
  Education: '#3B82F6',
  Health: '#EF4444',
  Environment: '#22C55E',
  Animals: '#F97316',
  Community: '#8B5CF6',
  Arts: '#EC4899',
};

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 0.75rem;
  max-width: 40rem;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.3);
`;

const ImageHeader = styled.div<{ $imageUrl?: string }>`
  position: relative;
  width: 100%;
  height: 12rem;
  background: ${(props) =>
    props.$imageUrl
      ? `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%), url(${props.$imageUrl})`
      : props.theme.colors.border.light};
  background-size: cover;
  background-position: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${(props) => props.theme.colors.text.primary};
  transition: all 0.2s ease;
  border-radius: 50%;
  backdrop-filter: blur(0.25rem);

  &:hover {
    background: #ffffff;
    transform: scale(1.05);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const CategoryBadge = styled.div<{ $color: string }>`
  background: ${(props) => props.$color};
  color: #ffffff;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ContentSection = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 12rem);
`;

const Title = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
`;

const LocationText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  margin-bottom: 1rem;

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Description = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0 0 1.5rem 0;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetricCard = styled.div`
  background: ${(props) => props.theme.colors.background.page};
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #00a0c4;
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.tertiary};
`;

const ProgressSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ProgressLabel = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  font-weight: 600;
`;

const ProgressPercentage = styled.span`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: 700;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.625rem;
  background: ${(props) => props.theme.colors.border.light};
  border-radius: 0.3125rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background: linear-gradient(90deg, #00a0c4, #0077b6);
  transition: width 0.3s ease;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: transparent;
  border: 2px solid #00a0c4;
  border-radius: 0.5rem;
  color: #00a0c4;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 160, 196, 0.1);
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 0.875rem;
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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function CampaignMapModal({ campaign, onClose, onAddToBasket }: CampaignMapModalProps) {
  const navigate = useNavigate();

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleLearnMore = useCallback(() => {
    if (campaign) {
      navigate(`/campaigns/${campaign.id}`);
      onClose();
    }
  }, [campaign, navigate, onClose]);

  const handleAddToBasket = useCallback(() => {
    if (campaign && onAddToBasket) {
      const defaultAmount = campaign.unitPrice || 50;
      onAddToBasket(campaign, defaultAmount, 1);
      onClose();
    }
  }, [campaign, onAddToBasket, onClose]);

  if (!campaign) return null;

  const categoryColor = campaign.category ? categoryColors[campaign.category] : '#6B7280';
  const progressPercentage = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);

  return createPortal(
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
      >
        <ModalContent
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ImageHeader $imageUrl={campaign.featuredImageUrl || undefined}>
            <CloseButton onClick={onClose}>
              <X />
            </CloseButton>
            <BadgeContainer>
              {campaign.category && (
                <CategoryBadge $color={categoryColor}>{campaign.category}</CategoryBadge>
              )}
            </BadgeContainer>
          </ImageHeader>

          <ContentSection>
            <Title>{campaign.title}</Title>
            {campaign.location && (
              <LocationText>
                <MapPin />
                {campaign.location}
              </LocationText>
            )}
            <Description>{campaign.shortDescription}</Description>

            <MetricsGrid>
              <MetricCard>
                <MetricValue>{formatCurrency(campaign.raisedAmount)}</MetricValue>
                <MetricLabel>Raised</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>{formatCurrency(campaign.goalAmount)}</MetricValue>
                <MetricLabel>Goal</MetricLabel>
              </MetricCard>
            </MetricsGrid>

            <ProgressSection>
              <ProgressHeader>
                <ProgressLabel>Funding Progress</ProgressLabel>
                <ProgressPercentage>{Math.round(progressPercentage)}%</ProgressPercentage>
              </ProgressHeader>
              <ProgressBar>
                <ProgressFill $percentage={progressPercentage} />
              </ProgressBar>
            </ProgressSection>

            <ButtonRow>
              <SecondaryButton onClick={handleLearnMore}>
                Learn More
                <ArrowRight />
              </SecondaryButton>
              <PrimaryButton onClick={handleAddToBasket}>
                <ShoppingBasket />
                Add to Basket
              </PrimaryButton>
            </ButtonRow>
          </ContentSection>
        </ModalContent>
      </Overlay>
    </AnimatePresence>,
    document.body
  );
}
