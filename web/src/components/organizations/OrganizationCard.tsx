import styled from 'styled-components';
import { Organization } from '../../api/types';

interface OrganizationCardProps {
  organization: Organization;
  onClick?: () => void;
}

const Card = styled.div<{ $clickable?: boolean }>`
  width: 10rem;
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

const LogoContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
`;

const Logo = styled.div<{ $logoUrl?: string; $bgColor?: string }>`
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.$logoUrl ? `url(${props.$logoUrl})` : props.$bgColor || props.theme.colors.primary.light};
  background-size: contain;
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
  background: ${(props) => props.theme.colors.primary.main};
  color: ${(props) => props.theme.colors.text.inverse};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 600;
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
        <AmountBadge>{formatCurrency(totalRaised)}</AmountBadge>
      </LogoContainer>
      <Content>
        <Name>{organization.name}</Name>
      </Content>
    </Card>
  );
};
