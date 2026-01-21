// This file shows how to integrate CampaignMap and CampaignFilters into HomePage
// DO NOT commit this file - it's for reference only

import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { CampaignMap } from './components/maps';
import { CampaignFilters, filterCampaigns, FilterState } from './components/filters';
import { CampaignCard } from './components/campaigns/CampaignCard';
import { OrganizationCard } from './components/organizations/OrganizationCard';
import { getCampaigns } from './api/campaigns';
import { getOrganizations } from './api';
import { Campaign, Organization } from './api/types';

const PageContainer = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.text.primary};
`;

const CampaignsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const OrganizationsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${(props) => props.theme.text.secondary};
`;

export function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    status: 'All',
    goalRange: 'Any',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [campaignsData, orgsData] = await Promise.all([
          getCampaigns({ page: 1, pageSize: 20 }),
          getOrganizations(),
        ]);
        setCampaigns(campaignsData);
        setOrganizations(orgsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCampaigns = useMemo(
    () => filterCampaigns(campaigns, filters),
    [campaigns, filters]
  );

  const handleMarkerClick = (organizationId: string) => {
    // Option 1: Scroll to organization section
    const orgSection = document.getElementById('organizations-section');
    if (orgSection) {
      orgSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Option 2: Filter campaigns by organization
    // const org = organizations.find((o) => o.id === organizationId);
    // if (org?.category) {
    //   setFilters({ ...filters, categories: [org.category] });
    // }

    // Option 3: Navigate to organization page
    // navigate(`/organizations/${organizationId}`);
  };

  if (loading) {
    return (
      <PageContainer>
        <div>Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Map Section */}
      <Section>
        <SectionTitle>Campaign Locations</SectionTitle>
        <CampaignMap organizations={organizations} onMarkerClick={handleMarkerClick} />
      </Section>

      {/* Campaigns Section */}
      <Section>
        <SectionTitle>Active Campaigns</SectionTitle>

        {/* Filter Bar */}
        <CampaignFilters filters={filters} onChange={setFilters} />

        {/* Results Count */}
        {filters.categories.length > 0 ||
        filters.status !== 'All' ||
        filters.goalRange !== 'Any' ? (
          <div style={{ padding: '1rem 0', fontSize: '0.875rem', color: '#666' }}>
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </div>
        ) : null}

        {/* Campaign Cards */}
        {filteredCampaigns.length > 0 ? (
          <CampaignsGrid>
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </CampaignsGrid>
        ) : (
          <NoResults>
            <p>No campaigns found matching your filters.</p>
            <button
              onClick={() =>
                setFilters({ categories: [], status: 'All', goalRange: 'Any' })
              }
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#00a0c4',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
              }}
            >
              Clear Filters
            </button>
          </NoResults>
        )}
      </Section>

      {/* Organizations Section */}
      <Section id="organizations-section">
        <SectionTitle>Organizations</SectionTitle>
        <OrganizationsGrid>
          {organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </OrganizationsGrid>
      </Section>
    </PageContainer>
  );
}
