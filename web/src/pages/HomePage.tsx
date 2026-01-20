import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
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
import {
  CampaignFilters,
  FilterState,
  filterCampaigns,
} from '../components/filters/CampaignFilters';
import { MetricsDashboard } from '../components/dashboard/MetricsDashboard';

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
  margin-left: 0;

  @media (min-width: 48rem) {
    margin-left: 16rem;
  }

  @media (max-width: 48rem) {
    padding-bottom: 5rem;
  }
`;

const ContentHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  background: ${(props) => props.theme.colors.background.card};
  border-bottom: 0.0625rem solid ${(props) => props.theme.colors.border.light};

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
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;

  @media (min-width: 48rem) {
    font-size: 1.75rem;
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

  &:hover {
    text-decoration: underline;
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
  padding: 2rem;

  @media (max-width: 48rem) {
    padding: 1.5rem;
  }
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

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 1rem;
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
  }

  @media (min-width: 48rem) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    overflow-x: visible;
    padding-bottom: 0;
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
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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

  const filteredCampaigns = useMemo(() => {
    return filterCampaigns(campaigns, filters);
  }, [campaigns, filters]);

  useEffect(() => {
    fetchCampaigns();
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

  const handleCampaignClick = (campaignId: string): void => {
    navigate(`/campaigns/${campaignId}`);
  };

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <ContentHeader>
          <HeaderTop>
            <HeaderTitle>{t('home.featuredCampaigns')}</HeaderTitle>
            <ViewAllLink>
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
              onMarkerClick={(orgId) => navigate(`/organizations/${orgId}`)}
            />
          </Section>

          <Section>
            <CampaignFilters filters={filters} onChange={setFilters} />
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>{t('home.campaigns')}</SectionTitle>
              <SeeAllLink>
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
                        onClick={() => handleCampaignClick(campaign.id)}
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
              <SeeAllLink>
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
            {orgsLoading && <LoadingText>{t('home.loadingOrganizations')}</LoadingText>}
            {orgsError && <ErrorText>{orgsError}</ErrorText>}
            {!orgsLoading && !orgsError && organizations.length === 0 && (
              <EmptyText>{t('home.noOrganizations')}</EmptyText>
            )}
            {!orgsLoading && !orgsError && organizations.length > 0 && (
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <HorizontalScroll>
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
                </HorizontalScroll>
              </motion.div>
            )}
          </Section>
        </Main>

        <BottomNavigation />
      </MainContent>
    </PageContainer>
  );
};
