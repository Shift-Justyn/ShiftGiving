import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getUserDonations } from '../api/donations';
import { DonationListItem } from '../api/types';

interface ImpactStats {
  totalDonated: number;
  campaignsSupported: number;
  organizationsHelped: number;
  donationCount: number;
}

export function ImpactPage() {
  const { user, token } = useAuth();
  const [donations, setDonations] = useState<DonationListItem[]>([]);
  const [stats, setStats] = useState<ImpactStats>({
    totalDonated: 0,
    campaignsSupported: 0,
    organizationsHelped: 0,
    donationCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      loadImpactData();
    }
  }, [user, token]);

  const loadImpactData = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      const userDonations = await getUserDonations(user.id, token);
      setDonations(userDonations);

      const uniqueCampaigns = new Set(userDonations.map((d) => d.campaignTitle));
      const uniqueOrgs = new Set(userDonations.map((d) => d.organizationName));
      const total = userDonations.reduce((sum, d) => sum + d.amount, 0);

      setStats({
        totalDonated: total,
        campaignsSupported: uniqueCampaigns.size,
        organizationsHelped: uniqueOrgs.size,
        donationCount: userDonations.length,
      });
    } catch (error) {
      console.error('Failed to load impact data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <PageTitle>My Impact</PageTitle>
          <PageSubtitle>See how your donations are making a difference</PageSubtitle>
        </Header>

        {isLoading ? (
          <LoadingState>
            <Spinner />
            <LoadingText>Loading your impact data...</LoadingText>
          </LoadingState>
        ) : (
          <>
            <StatsGrid>
              <StatCard
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                <StatIcon $color="#00a0c4">
                  <DollarIcon />
                </StatIcon>
                <StatValue>{formatCurrency(stats.totalDonated)}</StatValue>
                <StatLabel>Total Donated</StatLabel>
              </StatCard>

              <StatCard
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <StatIcon $color="#8B5CF6">
                  <CampaignIcon />
                </StatIcon>
                <StatValue>{stats.campaignsSupported}</StatValue>
                <StatLabel>Campaigns Supported</StatLabel>
              </StatCard>

              <StatCard
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <StatIcon $color="#22C55E">
                  <OrgIcon />
                </StatIcon>
                <StatValue>{stats.organizationsHelped}</StatValue>
                <StatLabel>Organizations Helped</StatLabel>
              </StatCard>

              <StatCard
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <StatIcon $color="#F97316">
                  <HeartIcon />
                </StatIcon>
                <StatValue>{stats.donationCount}</StatValue>
                <StatLabel>Total Donations</StatLabel>
              </StatCard>
            </StatsGrid>

            <Section>
              <SectionTitle>Recent Contributions</SectionTitle>
              {donations.length === 0 ? (
                <EmptyState>
                  <EmptyIcon />
                  <EmptyTitle>No donations yet</EmptyTitle>
                  <EmptyText>
                    Start making an impact by supporting campaigns you care about
                  </EmptyText>
                </EmptyState>
              ) : (
                <DonationList>
                  {donations.slice(0, 10).map((donation, index) => (
                    <DonationItem
                      key={donation.id}
                      as={motion.div}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <DonationInfo>
                        <DonationCampaign>{donation.campaignTitle}</DonationCampaign>
                        <DonationOrg>{donation.organizationName}</DonationOrg>
                      </DonationInfo>
                      <DonationMeta>
                        <DonationAmount>{formatCurrency(donation.amount)}</DonationAmount>
                        <DonationDate>
                          {new Date(donation.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </DonationDate>
                      </DonationMeta>
                    </DonationItem>
                  ))}
                </DonationList>
              )}
            </Section>

            <Section>
              <SectionTitle>Impact by Category</SectionTitle>
              <CategoryGrid>
                <CategoryCard $color="#F97316">
                  <CategoryName>Animals</CategoryName>
                  <CategoryAmount>
                    {formatCurrency(
                      donations
                        .filter(
                          (d) =>
                            d.campaignTitle.toLowerCase().includes('animal') ||
                            d.campaignTitle.toLowerCase().includes('pet')
                        )
                        .reduce((sum, d) => sum + d.amount, 0)
                    )}
                  </CategoryAmount>
                </CategoryCard>
                <CategoryCard $color="#8B5CF6">
                  <CategoryName>Community</CategoryName>
                  <CategoryAmount>
                    {formatCurrency(
                      donations
                        .filter(
                          (d) =>
                            d.campaignTitle.toLowerCase().includes('community') ||
                            d.campaignTitle.toLowerCase().includes('food')
                        )
                        .reduce((sum, d) => sum + d.amount, 0)
                    )}
                  </CategoryAmount>
                </CategoryCard>
                <CategoryCard $color="#3B82F6">
                  <CategoryName>Education</CategoryName>
                  <CategoryAmount>
                    {formatCurrency(
                      donations
                        .filter(
                          (d) =>
                            d.campaignTitle.toLowerCase().includes('education') ||
                            d.campaignTitle.toLowerCase().includes('school')
                        )
                        .reduce((sum, d) => sum + d.amount, 0)
                    )}
                  </CategoryAmount>
                </CategoryCard>
                <CategoryCard $color="#EF4444">
                  <CategoryName>Health</CategoryName>
                  <CategoryAmount>
                    {formatCurrency(
                      donations
                        .filter(
                          (d) =>
                            d.campaignTitle.toLowerCase().includes('health') ||
                            d.campaignTitle.toLowerCase().includes('medical')
                        )
                        .reduce((sum, d) => sum + d.amount, 0)
                    )}
                  </CategoryAmount>
                </CategoryCard>
                <CategoryCard $color="#22C55E">
                  <CategoryName>Environment</CategoryName>
                  <CategoryAmount>
                    {formatCurrency(
                      donations
                        .filter(
                          (d) =>
                            d.campaignTitle.toLowerCase().includes('environment') ||
                            d.campaignTitle.toLowerCase().includes('garden')
                        )
                        .reduce((sum, d) => sum + d.amount, 0)
                    )}
                  </CategoryAmount>
                </CategoryCard>
              </CategoryGrid>
            </Section>
          </>
        )}
      </MainContent>
    </PageContainer>
  );
}

const DollarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const CampaignIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const OrgIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const EmptyIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background.page};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: 4rem;
  }
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${(props) => props.theme.colors.border.light};
  border-top-color: ${(props) => props.theme.colors.primary.main};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${(props) => `${props.$color}15`};
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;

const Section = styled.section`
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 1.5rem 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: ${(props) => props.theme.colors.text.tertiary};
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 1rem 0 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  margin: 0;
  text-align: center;
`;

const DonationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DonationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${(props) => props.theme.colors.background.page};
  border-radius: 0.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(4px);
  }
`;

const DonationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const DonationCampaign = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DonationOrg = styled.div`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

const DonationMeta = styled.div`
  text-align: right;
  flex-shrink: 0;
  margin-left: 1rem;
`;

const DonationAmount = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary.main};
`;

const DonationDate = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  margin-top: 0.25rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryCard = styled.div<{ $color: string }>`
  padding: 1rem;
  background: ${(props) => `${props.$color}10`};
  border-radius: 0.5rem;
  border-left: 4px solid ${(props) => props.$color};
`;

const CategoryName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const CategoryAmount = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
`;
