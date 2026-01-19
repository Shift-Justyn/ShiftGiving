import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCampaigns, getOrganizations } from '../api/campaigns';
import { Campaign, Organization } from '../api/types';
import { CampaignCard } from '../components/campaigns/CampaignCard';
import { OrganizationCard } from '../components/organizations/OrganizationCard';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background.page};
  padding-bottom: 5rem;

  @media (min-width: 48rem) {
    padding-bottom: 2rem;
  }
`;

const Header = styled(motion.header)`
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.background.card} 0%,
    ${(props) => props.theme.colors.background.page} 100%
  );
  box-shadow: 0 0.125rem 0.5rem rgba(0, 160, 196, 0.08);

  @media (min-width: 48rem) {
    max-width: 75rem;
    margin: 0 auto;
    padding: 1.5rem 2rem;
  }
`;

const Avatar = styled(motion.div)`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main} 0%,
    ${(props) => props.theme.colors.primary.hover} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text.inverse};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 160, 196, 0.25);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 160, 196, 0.35);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NotificationButton = styled(motion.button)`
  position: relative;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text.secondary};
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.border.light};
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #ef4444;
  border: 0.125rem solid ${(props) => props.theme.colors.background.card};
`;

const SearchIcon = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text.secondary};
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.border.light};
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Main = styled.main`
  padding: 0 1.5rem;

  @media (min-width: 48rem) {
    max-width: 75rem;
    margin: 0 auto;
    padding: 0 2rem;
  }
`;

const Greeting = styled.div`
  margin: 1.5rem 0;
`;

const GreetingName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 0.25rem 0;

  @media (min-width: 48rem) {
    font-size: 2rem;
  }
`;

const GreetingMessage = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.primary.main};
  margin: 0;
  line-height: 1.4;

  @media (min-width: 48rem) {
    font-size: 1.25rem;
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
  margin-bottom: 2rem;

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

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const SeeAllLink = styled.button`
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary.main};
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
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

const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const greetingVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.2,
      ease: 'easeOut',
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [orgsError, setOrgsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const userName = user?.firstName || 'Guest';
  const userInitials = user ? getInitials(user.firstName, user.lastName) : 'G';

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

  const updateCount = campaigns.length + organizations.length;

  return (
    <Container>
      <Header initial="hidden" animate="visible" variants={headerVariants}>
        <Avatar
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {userInitials}
        </Avatar>
        <HeaderActions>
          <NotificationButton
            aria-label="Notifications"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {updateCount > 0 && <NotificationBadge />}
          </NotificationButton>
          <SearchIcon aria-label="Search">
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
          </SearchIcon>
        </HeaderActions>
      </Header>

      <Main>
        <motion.div initial="hidden" animate="visible" variants={greetingVariants}>
          <Greeting>
            <GreetingName>{t('home.greeting', { name: userName })}</GreetingName>
            <GreetingMessage>{t('home.updates', { count: updateCount })}</GreetingMessage>
          </Greeting>
        </motion.div>

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

        <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
          <Section>
            <SectionHeader>
              <SectionTitle>
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t('home.campaigns')}
              </SectionTitle>
              <SeeAllLink>{t('home.seeAll')}</SeeAllLink>
            </SectionHeader>
            {campaignsLoading && <LoadingText>{t('home.loadingCampaigns')}</LoadingText>}
            {campaignsError && <ErrorText>{campaignsError}</ErrorText>}
            {!campaignsLoading && !campaignsError && campaigns.length === 0 && (
              <EmptyText>{t('home.noCampaigns')}</EmptyText>
            )}
            {!campaignsLoading && !campaignsError && campaigns.length > 0 && (
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <HorizontalScroll>
                  {campaigns.map((campaign, index) => (
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
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ delay: 0.2 }}
        >
          <Section>
            <SectionHeader>
              <SectionTitle>
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {t('home.organizations')}
              </SectionTitle>
              <SeeAllLink>{t('home.seeAll')}</SeeAllLink>
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
        </motion.div>
      </Main>

      <BottomNavigation />
    </Container>
  );
};
