import styled from 'styled-components';
import { Heart, Users, GraduationCap, Stethoscope, Palette } from 'lucide-react';
import { Organization } from '../../api/types';

interface OrganizationCardProps {
  organization: Organization;
  onClick?: () => void;
}

const Card = styled.div<{ $clickable?: boolean }>`
  width: 100%;
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
    transform: ${(props) => (props.$clickable ? 'translateY(-0.25rem) scale(1.02)' : 'none')};
    box-shadow: ${(props) =>
      props.$clickable
        ? '0 0.5rem 1.5rem rgba(0, 160, 196, 0.2)'
        : '0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)'};
    background: ${(props) =>
      props.$clickable
        ? `linear-gradient(to bottom, ${props.theme.colors.background.card}, rgba(0, 160, 196, 0.02))`
        : props.theme.colors.background.card};
  }
`;

const LogoContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 0.62;
`;

const Logo = styled.div<{ $logoUrl?: string; $bgColor?: string }>`
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.$logoUrl
      ? `url(${props.$logoUrl})`
      : `linear-gradient(135deg, ${props.theme.colors.primary.light} 0%, ${props.theme.colors.primary.main}40 100%)`};
  background-color: ${(props) => (props.$logoUrl ? '#ffffff' : 'transparent')};
  background-size: ${(props) => (props.$logoUrl ? '80% auto' : 'contain')};
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoPlaceholder = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary.main};
`;

const AmountBadge = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main} 0%,
    #007a94 100%
  );
  color: ${(props) => props.theme.colors.text.inverse};
  padding: 0.25rem 0.625rem;
  border-radius: 1rem;
  font-size: 0.6875rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
`;

const CategoryIcon = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  svg {
    width: 0.875rem;
    height: 0.875rem;
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const Content = styled.div`
  padding: 0.75rem;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const formatCurrency = (amount: number): string => {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'Animals':
      return <Heart />;
    case 'Community':
      return <Users />;
    case 'Education':
      return <GraduationCap />;
    case 'Health':
      return <Stethoscope />;
    case 'Arts':
      return <Palette />;
    default:
      return <Users />;
  }
};

export const OrganizationCard = ({ organization, onClick }: OrganizationCardProps) => {
  const totalRaised = (organization.campaignCount || 0) * 15000;

  return (
    <Card $clickable={!!onClick} onClick={onClick}>
      <LogoContainer>
        <Logo $logoUrl={organization.logoUrl || undefined}>
          {!organization.logoUrl && (
            <LogoPlaceholder>{getInitials(organization.name)}</LogoPlaceholder>
          )}
        </Logo>
        <CategoryIcon>{getCategoryIcon(organization.category)}</CategoryIcon>
        <AmountBadge>{formatCurrency(totalRaised)}</AmountBadge>
      </LogoContainer>
      <Content>
        <Name>{organization.name}</Name>
      </Content>
    </Card>
  );
};
