import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { Sidebar } from '../components/Sidebar';
import { donations, organizations } from '../mocks/data';

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

const Header = styled.header`
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.colors.background.card};

  @media (min-width: 48rem) {
    max-width: 75rem;
    margin: 0 auto;
    padding: 1.5rem 2rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.button`
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
  border: none;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;

  @media (min-width: 48rem) {
    font-size: 1.75rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const Main = styled.main`
  padding: 1.5rem;

  @media (min-width: 48rem) {
    max-width: 75rem;
    margin: 0 auto;
    padding: 1.5rem 2rem;
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
  margin-bottom: 1.5rem;

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

const DonationList = styled(motion.ul)`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DonationCard = styled(motion.li)`
  background: ${(props) => props.theme.colors.background.card};
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary.main};
    transform: translateY(-0.125rem);
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  }
`;

const DonationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DonationDate = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.tertiary};
`;

const DonationOrg = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
`;

const DonationAmount = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary.main};
`;

const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatAmount = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

const getOrganizationName = (orgId: string): string => {
  const org = organizations.find((o) => o.id === orgId);
  return org?.name || 'Unknown';
};

export const HistoryPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const userInitials = user ? getInitials(user.firstName, user.lastName) : 'G';

  const userDonations = donations.filter((donation) => donation.userId === user?.id);

  const filteredDonations = userDonations.filter((donation) => {
    const orgName = getOrganizationName(donation.organizationId);
    return orgName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <HeaderLeft>
            <Avatar aria-label="User avatar">{userInitials}</Avatar>
            <Title>History</Title>
          </HeaderLeft>
          <HeaderRight>
            <IconButton aria-label="Add">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </IconButton>
            <IconButton aria-label="Export">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </IconButton>
            <IconButton aria-label="Print">
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
            </IconButton>
          </HeaderRight>
        </Header>

        <Main>
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
              placeholder="Search for a charity or nonprofit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>

          <DonationList
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredDonations.map((donation, index) => (
              <DonationCard
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <DonationInfo>
                  <DonationDate>{formatDate(donation.createdAt)}</DonationDate>
                  <DonationOrg>{getOrganizationName(donation.organizationId)}</DonationOrg>
                </DonationInfo>
                <DonationAmount>{formatAmount(donation.amount)}</DonationAmount>
              </DonationCard>
            ))}
          </DonationList>
        </Main>

        <BottomNavigation />
      </MainContent>
    </PageContainer>
  );
};
