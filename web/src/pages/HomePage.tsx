import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getCampaigns, getOrganizations } from '../api/campaigns';
import { Campaign, Organization } from '../api/types';
import { CampaignCard } from '../components/campaigns/CampaignCard';
import { OrganizationCard } from '../components/organizations/OrganizationCard';
import { ThemeToggle } from '../components/ThemeToggle';

const Container = styled.div`
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background.page};
`;

const Header = styled.header`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main} 0%,
    ${(props) => props.theme.colors.primary.hover} 100%
  );
  color: ${(props) => props.theme.colors.text.inverse};
  padding: 2rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 75rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 48rem) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;

  @media (max-width: 48rem) {
    font-size: 1.5rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: ${(props) => props.theme.colors.text.inverse};
  border: 0.125rem solid ${(props) => props.theme.colors.text.inverse};
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Main = styled.main`
  max-width: 75rem;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 48rem) {
    padding: 1rem;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 1.5rem 0;

  @media (max-width: 48rem) {
    font-size: 1.5rem;
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.border.light};
    border-radius: 0.25rem;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.primary.main};
    border-radius: 0.25rem;
  }

  @media (max-width: 48rem) {
    flex-direction: column;
    overflow-x: visible;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.5rem;

  @media (max-width: 48rem) {
    grid-template-columns: 1fr;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.error};
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;

export const HomePage = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [orgsError, setOrgsError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
    fetchOrganizations();
  }, []);

  const fetchCampaigns = async (): Promise<void> => {
    try {
      setCampaignsLoading(true);
      const campaigns = await getCampaigns({ page: 1, pageSize: 10, featured: true });
      setCampaigns(campaigns);
    } catch {
      setCampaignsError(t('home.failedLoadCampaigns'));
    } finally {
      setCampaignsLoading(false);
    }
  };

  const fetchOrganizations = async (): Promise<void> => {
    try {
      setOrgsLoading(true);
      const organizations = await getOrganizations();
      setOrganizations(organizations);
    } catch {
      setOrgsError(t('home.failedLoadOrganizations'));
    } finally {
      setOrgsLoading(false);
    }
  };

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>{t('home.welcome')}</Title>
          <HeaderActions>
            <ThemeToggle />
            <LogoutButton onClick={handleLogout}>{t('auth.logout')}</LogoutButton>
          </HeaderActions>
        </HeaderContent>
      </Header>
      <Main>
        <Section>
          <SectionTitle>{t('home.featuredCampaigns')}</SectionTitle>
          {campaignsLoading && <LoadingText>{t('home.loadingCampaigns')}</LoadingText>}
          {campaignsError && <ErrorText>{campaignsError}</ErrorText>}
          {!campaignsLoading && !campaignsError && campaigns.length === 0 && (
            <EmptyText>{t('home.noCampaigns')}</EmptyText>
          )}
          {!campaignsLoading && !campaignsError && campaigns.length > 0 && (
            <ScrollContainer>
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </ScrollContainer>
          )}
        </Section>
        <Section>
          <SectionTitle>{t('home.organizations')}</SectionTitle>
          {orgsLoading && <LoadingText>{t('home.loadingOrganizations')}</LoadingText>}
          {orgsError && <ErrorText>{orgsError}</ErrorText>}
          {!orgsLoading && !orgsError && organizations.length === 0 && (
            <EmptyText>{t('home.noOrganizations')}</EmptyText>
          )}
          {!orgsLoading && !orgsError && organizations.length > 0 && (
            <Grid>
              {organizations.map((organization) => (
                <OrganizationCard key={organization.id} organization={organization} />
              ))}
            </Grid>
          )}
        </Section>
      </Main>
    </Container>
  );
};
