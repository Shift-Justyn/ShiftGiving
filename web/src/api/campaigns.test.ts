import * as client from './client';
import { getCampaigns, getCampaignById, getOrganizations, getOrganizationById } from './campaigns';

jest.mock('./client');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getCampaigns', () => {
  it('calls get with campaigns endpoint', async () => {
    const mockResponse = { campaigns: [], totalCount: 0, page: 1, pageSize: 10 };
    (client.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getCampaigns();

    expect(result).toEqual(mockResponse);
  });
});

describe('getCampaigns endpoint', () => {
  it('uses correct endpoint', async () => {
    (client.get as jest.Mock).mockResolvedValue({
      campaigns: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
    });

    await getCampaigns();

    expect(client.get).toHaveBeenCalledWith('/api/campaigns', undefined);
  });
});

describe('getCampaigns with params', () => {
  it('passes query params', async () => {
    (client.get as jest.Mock).mockResolvedValue({
      campaigns: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
    });

    await getCampaigns({ page: 2, pageSize: 20, status: 'Active', featured: true });

    expect(client.get).toHaveBeenCalledWith('/api/campaigns', {
      page: 2,
      pageSize: 20,
      status: 'Active',
      featured: true,
    });
  });
});

describe('getCampaignById', () => {
  it('calls get with campaign id', async () => {
    const mockCampaign = {
      id: 'camp1',
      name: 'Test Campaign',
      description: 'Test',
      goalAmount: 1000,
      raisedAmount: 500,
      status: 'Active',
      featured: true,
      organizationId: 'org1',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    };
    (client.get as jest.Mock).mockResolvedValue(mockCampaign);

    const result = await getCampaignById('camp1');

    expect(result).toEqual(mockCampaign);
  });
});

describe('getCampaignById endpoint', () => {
  it('uses correct endpoint with id', async () => {
    (client.get as jest.Mock).mockResolvedValue({});

    await getCampaignById('camp1');

    expect(client.get).toHaveBeenCalledWith('/api/campaigns/camp1');
  });
});

describe('getOrganizations', () => {
  it('calls get with organizations endpoint', async () => {
    const mockResponse = { organizations: [], totalCount: 0 };
    (client.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getOrganizations();

    expect(result).toEqual(mockResponse);
  });
});

describe('getOrganizations endpoint', () => {
  it('uses correct endpoint', async () => {
    (client.get as jest.Mock).mockResolvedValue({ organizations: [], totalCount: 0 });

    await getOrganizations();

    expect(client.get).toHaveBeenCalledWith('/api/organizations');
  });
});

describe('getOrganizationById', () => {
  it('calls get with organization id', async () => {
    const mockOrganization = {
      id: 'org1',
      name: 'Test Org',
      description: 'Test',
      email: 'test@example.com',
      phone: '555-1234',
      website: 'https://example.com',
      logoUrl: 'https://example.com/logo.png',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    };
    (client.get as jest.Mock).mockResolvedValue(mockOrganization);

    const result = await getOrganizationById('org1');

    expect(result).toEqual(mockOrganization);
  });
});

describe('getOrganizationById endpoint', () => {
  it('uses correct endpoint with id', async () => {
    (client.get as jest.Mock).mockResolvedValue({});

    await getOrganizationById('org1');

    expect(client.get).toHaveBeenCalledWith('/api/organizations/org1');
  });
});
