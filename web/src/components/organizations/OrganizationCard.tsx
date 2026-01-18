import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Organization } from '../../api/types';

interface OrganizationCardProps {
  organization: Organization;
}

const Card = styled.div`
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-0.25rem);
  }

  @media (max-width: 48rem) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Logo = styled.div<{ $logoUrl?: string }>`
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  background: ${(props) =>
    props.$logoUrl ? `url(${props.$logoUrl})` : props.theme.colors.border.light};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <Header>
        <Logo $logoUrl={organization.logoUrl || undefined} />
        <Name>{organization.name}</Name>
      </Header>
      <Description>{organization.description || t('organization.noDescription')}</Description>
    </Card>
  );
};
