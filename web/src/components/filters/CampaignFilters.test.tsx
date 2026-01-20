import { filterCampaigns, FilterState } from './CampaignFilters';
import { Campaign } from '../../api/types';

describe('filterCampaigns', () => {
  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      title: 'Test Campaign 1',
      shortDescription: 'Description 1',
      goalAmount: 5000,
      raisedAmount: 2500,
      status: 'Active',
      featuredImageUrl: null,
      organization: { id: 'org-1', name: 'Org 1', logoUrl: null },
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Education',
      location: 'Test City',
    },
    {
      id: '2',
      title: 'Test Campaign 2',
      shortDescription: 'Description 2',
      goalAmount: 25000,
      raisedAmount: 15000,
      status: 'Active',
      featuredImageUrl: null,
      organization: { id: 'org-2', name: 'Org 2', logoUrl: null },
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Health',
      location: 'Test City',
    },
    {
      id: '3',
      title: 'Test Campaign 3',
      shortDescription: 'Description 3',
      goalAmount: 75000,
      raisedAmount: 50000,
      status: 'Active',
      featuredImageUrl: null,
      organization: { id: 'org-3', name: 'Org 3', logoUrl: null },
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Environment',
      location: 'Test City',
    },
  ];

  it('returns all campaigns when no filters applied', () => {
    const filters: FilterState = {
      categories: [],
      status: 'All',
      goalRange: 'Any',
    };

    const result = filterCampaigns(mockCampaigns, filters);

    expect(result.length).toBe(3);
  });

  it('filters by single category', () => {
    const filters: FilterState = {
      categories: ['Education'],
      status: 'All',
      goalRange: 'Any',
    };

    const result = filterCampaigns(mockCampaigns, filters);

    expect(result.length).toBe(1);
  });

  it('filters by multiple categories', () => {
    const filters: FilterState = {
      categories: ['Education', 'Health'],
      status: 'All',
      goalRange: 'Any',
    };

    const result = filterCampaigns(mockCampaigns, filters);

    expect(result.length).toBe(2);
  });

  it('filters by goal range under $10k', () => {
    const filters: FilterState = {
      categories: [],
      status: 'All',
      goalRange: 'Under $10k',
    };

    const result = filterCampaigns(mockCampaigns, filters);

    expect(result.length).toBe(1);
  });

  it('filters by goal range $10k-$50k', () => {
    const filters: FilterState = {
      categories: [],
      status: 'All',
      goalRange: '$10k-$50k',
    };

    const result = filterCampaigns(mockCampaigns, filters);

    expect(result.length).toBe(1);
  });

  it('filters by goal range $50k+', () => {
    const filters: FilterState = {
      categories: [],
      status: 'All',
      goalRange: '$50k+',
    };

    const result = filterCampaigns(mockCampaigns, filters);

    expect(result.length).toBe(1);
  });

  it('combines category and goal range filters', () => {
    const filters: FilterState = {
      categories: ['Education'],
      status: 'All',
      goalRange: 'Under $10k',
    };

    const result = filterCampaigns(mockCampaigns, filters);

    expect(result.length).toBe(1);
  });

  it('returns empty array when no campaigns match', () => {
    const filters: FilterState = {
      categories: ['Arts'],
      status: 'All',
      goalRange: 'Any',
    };

    const result = filterCampaigns(mockCampaigns, filters);

    expect(result.length).toBe(0);
  });
});
