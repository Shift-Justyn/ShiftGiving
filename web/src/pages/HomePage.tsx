import { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCampaigns, getOrganizations } from '../api/campaigns';
import { Campaign, Organization } from '../api/types';
import { CampaignCard } from '../components/campaigns/CampaignCard';
import { OrganizationCard } from '../components/organizations/OrganizationCard';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { Sidebar } from '../components/Sidebar';
import { CampaignMap } from '../components/maps/CampaignMap';
import { CampaignMapModal } from '../components/maps/CampaignMapModal';
import {
  CampaignFilters,
  FilterState,
  filterCampaigns,
} from '../components/filters/CampaignFilters';
import { MetricsDashboard } from '../components/dashboard/MetricsDashboard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const focusGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 160, 196, 0.4); }
  70% { box-shadow: 0 0 0 0.25rem rgba(0, 160, 196, 0.1); }
  100% { box-shadow: 0 0 0 0.25rem rgba(0, 160, 196, 0.1); }
`;

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background.page};

  @media (max-width: 48rem) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  @media (max-width: 48rem) {
    padding-bottom: 5rem;
  }
`;

const ContentHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  background: linear-gradient(
    180deg,
    ${(props) => props.theme.colors.background.card} 0%,
    ${(props) => props.theme.colors.background.page} 100%
  );
  border-bottom: 0.0625rem solid ${(props) => props.theme.colors.border.light};
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 5;

  @media (max-width: 48rem) {
    padding: 5rem 1.5rem 1rem 1.5rem;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.text.primary} 0%,
    ${(props) => props.theme.colors.primary.main} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;

  @media (min-width: 48rem) {
    font-size: 2rem;
  }
`;

const ViewAllLink = styled.button`
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary.main};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
    transform: translateX(0.25rem);
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;

  @media (min-width: 48rem) {
    font-size: 1rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${(props) => props.theme.colors.background.card};
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 2rem;
  padding: 0.75rem 1.25rem;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: ${(props) => props.theme.colors.primary.main};
    box-shadow: 0 0 0 0.25rem rgba(0, 160, 196, 0.1);
    animation: ${focusGlow} 0.3s ease;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${(props) => props.theme.colors.text.tertiary};
    flex-shrink: 0;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.primary};
  outline: none;

  &::placeholder {
    color: ${(props) => props.theme.colors.text.tertiary};
  }
`;

const Main = styled.main`
  position: relative;
  overflow: hidden;
  padding: 2rem;

  @media (max-width: 48rem) {
    padding: 1.5rem;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(0, 160, 196, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(0, 160, 196, 0.05) 0%, transparent 50%);
  pointer-events: none;
`;

const Section = styled.section`
  margin-bottom: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;

  @media (min-width: 48rem) {
    font-size: 1.5rem;
  }
`;

const SeeAllLink = styled.button`
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary.main};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
    transform: translateX(0.25rem);
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    scroll-snap-align: start;
    flex-shrink: 0;
    min-width: 20rem;
  }

  @media (min-width: 48rem) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 1fr;
    align-items: stretch;
    overflow-x: visible;
    padding-bottom: 0;

    > * {
      min-width: unset;
      height: 100%;
    }
  }

  @media (min-width: 64rem) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
`;

const OrganizationCarousel = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 0.375rem;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.background.page};
    border-radius: 0.1875rem;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.primary.light};
    border-radius: 0.1875rem;

    &:hover {
      background: ${(props) => props.theme.colors.primary.main};
    }
  }

  > * {
    scroll-snap-align: start;
    flex-shrink: 0;
    width: calc((100% - 2rem) / 3.5);
    min-width: 8rem;
  }

  @media (max-width: 48rem) {
    > * {
      width: calc((100% - 1.5rem) / 2.5);
      min-width: 7rem;
    }
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [orgsError, setOrgsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    status: 'All',
    goalRange: 'Any',
  });
  const [selectedMapCampaign, setSelectedMapCampaign] = useState<Campaign | null>(null);

  const filteredCampaigns = useMemo(() => {
    return filterCampaigns(campaigns, filters);
  }, [campaigns, filters]);

  useEffect(() => {
    fetchCampaigns();
    fetchAllCampaigns();
    fetchOrganizations();
  }, []);

  const fetchCampaigns = async (): Promise<void> => {
    try {
      setCampaignsLoading(true);
      const data = await getCampaigns({ page: 1, pageSize: 10, featured: true });
      setCampaigns(data);
    } catch {
      setCampaignsError(t('home.failedLoadCampaigns'));
    } finally {
      setCampaignsLoading(false);
    }
  };

  const fetchAllCampaigns = async (): Promise<void> => {
    try {
      const data = await getCampaigns({ page: 1, pageSize: 50 });
      setAllCampaigns(data);
    } catch {
      // Silently fail for map campaigns - map will just show fewer pins
    }
  };

  const fetchOrganizations = async (): Promise<void> => {
    try {
      setOrgsLoading(true);
      const data = await getOrganizations();
      setOrganizations(data);
    } catch {
      setOrgsError(t('home.failedLoadOrganizations'));
    } finally {
      setOrgsLoading(false);
    }
  };

  const handleAddToBasket = (campaign: Campaign, amount: number, quantity: number): void => {
    addToCart(campaign, amount, quantity);
  };

  const handleCampaignMarkerClick = (campaign: Campaign): void => {
    setSelectedMapCampaign(campaign);
  };

  const handleCloseMapModal = (): void => {
    setSelectedMapCampaign(null);
  };

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <ContentHeader>
          <HeaderTop>
            <HeaderTitle>Welcome back, {user?.firstName || 'Friend'}</HeaderTitle>
            <ViewAllLink onClick={() => navigate('/campaigns')}>
              {t('home.viewAll')}
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </ViewAllLink>
          </HeaderTop>
          <HeaderSubtitle>{t('home.discoverCampaigns')}</HeaderSubtitle>
          <SearchBar>
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
            <SearchInput
              type="text"
              placeholder={t('home.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
        </ContentHeader>

        <Main>
          <BackgroundPattern />
          <Section>
            <MetricsDashboard
              totalDonated={45750}
              campaignsSupported={12}
              familiesHelped={458}
              organizations={8}
            />
          </Section>

          <Section>
            <CampaignMap
              organizations={organizations}
              campaigns={allCampaigns}
              onMarkerClick={(orgId) => navigate(`/organizations/${orgId}`)}
              onCampaignMarkerClick={handleCampaignMarkerClick}
            />
            <div style={{ marginTop: '0.5rem' }}>
              <CampaignFilters filters={filters} onChange={setFilters} />
            </div>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>{t('home.campaigns')}</SectionTitle>
              <SeeAllLink onClick={() => navigate('/campaigns')}>
                {t('home.seeAll')}
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </SeeAllLink>
            </SectionHeader>
            {campaignsLoading && <LoadingText>{t('home.loadingCampaigns')}</LoadingText>}
            {campaignsError && <ErrorText>{campaignsError}</ErrorText>}
            {!campaignsLoading && !campaignsError && filteredCampaigns.length === 0 && (
              <EmptyText>{t('home.noCampaigns')}</EmptyText>
            )}
            {!campaignsLoading && !campaignsError && filteredCampaigns.length > 0 && (
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <HorizontalScroll>
                  {filteredCampaigns.map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      id={`campaign-${campaign.id}`}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.5,
                            delay: index * 0.1,
                          },
                        },
                      }}
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <CampaignCard
                        campaign={campaign}
                        onClick={() => {}}
                        onAddToBasket={handleAddToBasket}
                      />
                    </motion.div>
                  ))}
                </HorizontalScroll>
              </motion.div>
            )}
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>{t('home.organizations')}</SectionTitle>
            </SectionHeader>
            {orgsLoading && <LoadingText>{t('home.loadingOrganizations')}</LoadingText>}
            {orgsError && <ErrorText>{orgsError}</ErrorText>}
            {!orgsLoading && !orgsError && organizations.length === 0 && (
              <EmptyText>{t('home.noOrganizations')}</EmptyText>
            )}
            {!orgsLoading && !orgsError && organizations.length > 0 && (
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <OrganizationCarousel>
                  {organizations.map((organization, index) => (
                    <motion.div
                      key={organization.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.5,
                            delay: index * 0.1,
                          },
                        },
                      }}
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <OrganizationCard organization={organization} />
                    </motion.div>
                  ))}
                </OrganizationCarousel>
              </motion.div>
            )}
          </Section>
        </Main>

        <BottomNavigation />
      </MainContent>

      <CampaignMapModal
        campaign={selectedMapCampaign}
        onClose={handleCloseMapModal}
        onAddToBasket={handleAddToBasket}
      />
    </PageContainer>
  );
};
