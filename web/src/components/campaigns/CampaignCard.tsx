import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Campaign } from '../../api/types';

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
}

const Card = styled.div<{ $clickable?: boolean }>`
  width: 16rem;
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background 0.3s ease;
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};

  &:hover {
    transform: ${(props) => (props.$clickable ? 'translateY(-0.25rem)' : 'none')};
    box-shadow: ${(props) =>
      props.$clickable
        ? '0 0.5rem 1.5rem rgba(0, 160, 196, 0.2)'
        : '0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)'};
    background: ${(props) =>
      props.$clickable
        ? `linear-gradient(to bottom, ${props.theme.colors.background.card}, rgba(0, 160, 196, 0.02))`
        : props.theme.colors.background.card};
  }

  @media (min-width: 48rem) {
    width: 100%;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 10rem;
`;

const Image = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.$imageUrl ? `url(${props.$imageUrl})` : props.theme.colors.border.light};
  background-size: cover;
  background-position: center;
`;

const AmountBadge = styled.div`
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  background: ${(props) => props.theme.colors.primary.main};
  color: ${(props) => props.theme.colors.text.inverse};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Content = styled.div`
  padding: 1rem;
`;

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
`;

const Description = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProgressContainer = styled.div`
  margin-bottom: 0.75rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${(props) => props.theme.colors.border.light};
  border-radius: 0.25rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${(props) => props.theme.colors.primary.main} 0%,
    ${(props) => props.theme.colors.primary.hover} 100%
  );
  transition: width 0.3s;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const Raised = styled.span`
  color: ${(props) => props.theme.colors.primary.main};
  font-weight: 600;
`;

const Goal = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
`;

const OrgName = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 0.0625rem solid ${(props) => props.theme.colors.border.light};
`;

const calculateProgress = (raised: number, goal: number): number => {
  return Math.min((raised / goal) * 100, 100);
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const CampaignCard = ({ campaign, onClick }: CampaignCardProps) => {
  const { t } = useTranslation();
  const progressPercentage = calculateProgress(campaign.raisedAmount, campaign.goalAmount);

  return (
    <Card $clickable={!!onClick} onClick={onClick}>
      <ImageContainer>
        <Image $imageUrl={campaign.featuredImageUrl || undefined} />
        <AmountBadge>{formatCurrency(campaign.raisedAmount)}</AmountBadge>
      </ImageContainer>
      <Content>
        <Title>{campaign.title}</Title>
        <Description>{campaign.shortDescription}</Description>
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill $percentage={progressPercentage} />
          </ProgressBar>
          <ProgressText>
            <Raised>{formatCurrency(campaign.raisedAmount)}</Raised>
            <Goal>
              {t('campaign.of')} {formatCurrency(campaign.goalAmount)}
            </Goal>
          </ProgressText>
        </ProgressContainer>
        <OrgName>{campaign.organization.name}</OrgName>
      </Content>
    </Card>
  );
};
