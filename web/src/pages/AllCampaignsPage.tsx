import { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { getCampaigns } from '../api/campaigns';
import { Campaign } from '../api/types';
import { CampaignCard } from '../components/campaigns/CampaignCard';
import { Sidebar } from '../components/Sidebar';

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background.page};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: ${(props) => props.theme.colors.background.card};
  border-bottom: 0.0625rem solid ${(props) => props.theme.colors.border.light};
  padding: 1rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;

  @media (max-width: 48rem) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.background.page};
    color: ${(props) => props.theme.colors.text.primary};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Divider = styled.div`
  width: 0.0625rem;
  height: 1.5rem;
  background: ${(props) => props.theme.colors.border.light};
`;

const TitleSection = styled.div``;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0.25rem 0 0 0;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 20rem;

  @media (max-width: 48rem) {
    width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.text.tertiary};

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border: 0.0625rem solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background: ${(props) => props.theme.colors.background.page};
  color: ${(props) => props.theme.colors.text.primary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #00a0c4;
    background: ${(props) => props.theme.colors.background.card};
    box-shadow: 0 0 0 0.125rem rgba(0, 160, 196, 0.1);
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.tertiary};
  }
`;

const Content = styled.div`
  flex: 1;
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
`;

const SearchResultsHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchResultsTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
`;

const SearchResultsCount = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0.25rem 0 0 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  color: ${(props) => props.theme.colors.text.tertiary};
  margin-bottom: 1rem;

  svg {
    width: 3rem;
    height: 3rem;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0 0 1rem 0;
`;

const ClearButton = styled.button`
  background: none;
  border: 0.0625rem solid #00a0c4;
  color: #00a0c4;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 160, 196, 0.1);
  }
`;

const CampaignsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 48rem) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 64rem) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CampaignWrapper = styled.div<{ $highlighted?: boolean }>`
  transition: all 0.3s ease;
  border-radius: 0.75rem;
  ${(props) =>
    props.$highlighted &&
    `
    box-shadow: 0 0 1.375rem rgba(0, 160, 196, 0.3);
  `}
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: ${(props) => props.theme.colors.text.secondary};
`;

export const AllCampaignsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedCampaignId, setHighlightedCampaignId] = useState<string | null>(null);
  const campaignRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCampaigns();
        setCampaigns(data);
      } catch {
        // Error handled silently
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const searchParam = searchParams.get('search');
    const highlightParam = searchParams.get('highlight');

    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    }

    if (highlightParam) {
      setHighlightedCampaignId(highlightParam);

      setTimeout(() => {
        const campaignElement = campaignRefs.current[highlightParam];
        if (campaignElement) {
          campaignElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          setTimeout(() => {
            setHighlightedCampaignId(null);
          }, 3000);
        }
      }, 500);
    }
  }, [searchParams, campaigns]);

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery.trim()) return campaigns;

    const query = searchQuery.toLowerCase().trim();
    return campaigns.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(query) ||
        campaign.shortDescription?.toLowerCase().includes(query) ||
        campaign.location?.toLowerCase().includes(query) ||
        campaign.category?.toLowerCase().includes(query) ||
        campaign.organization.name.toLowerCase().includes(query)
    );
  }, [campaigns, searchQuery]);

  const handleAddToBasket = (_campaign: Campaign, _amount: number): void => {
    // Handle add to basket (would connect to basket state/context)
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Sidebar />
        <MainContent>
          <LoadingContainer>Loading campaigns...</LoadingContainer>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <HeaderContent>
            <HeaderLeft>
              <BackButton onClick={() => navigate('/')}>
                <ArrowLeft />
                Back to Dashboard
              </BackButton>
              <Divider />
              <TitleSection>
                <Title>All Campaigns</Title>
                <Subtitle>Discover and support impactful initiatives worldwide</Subtitle>
              </TitleSection>
            </HeaderLeft>
            <SearchContainer>
              <SearchIcon>
                <Search />
              </SearchIcon>
              <SearchInput
                type="search"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
          </HeaderContent>
        </Header>

        <Content>
          {searchQuery && (
            <SearchResultsHeader>
              <SearchResultsTitle>
                Search Results for &ldquo;{searchQuery}&rdquo;
              </SearchResultsTitle>
              <SearchResultsCount>
                {filteredCampaigns.length}{' '}
                {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'} found
              </SearchResultsCount>
            </SearchResultsHeader>
          )}

          {filteredCampaigns.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <Search />
              </EmptyIcon>
              <EmptyTitle>
                {searchQuery ? 'No campaigns found' : 'No campaigns available'}
              </EmptyTitle>
              <EmptyText>
                {searchQuery
                  ? 'Try adjusting your search terms or browse all available campaigns.'
                  : 'Check back later for new opportunities.'}
              </EmptyText>
              {searchQuery && (
                <ClearButton onClick={() => setSearchQuery('')}>Clear Search</ClearButton>
              )}
            </EmptyState>
          ) : (
            <CampaignsGrid>
              {filteredCampaigns.map((campaign) => (
                <CampaignWrapper
                  key={campaign.id}
                  ref={(el) => {
                    campaignRefs.current[campaign.id] = el;
                  }}
                  $highlighted={highlightedCampaignId === campaign.id}
                >
                  <CampaignCard
                    campaign={campaign}
                    onClick={() => {}}
                    onAddToBasket={handleAddToBasket}
                  />
                </CampaignWrapper>
              ))}
            </CampaignsGrid>
          )}
        </Content>
      </MainContent>
    </PageContainer>
  );
};
