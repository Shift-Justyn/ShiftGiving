import * as client from './client';
import {
  createDonation,
  getDonationById,
  getUserDonations,
  getCampaignDonations,
  getCampaignDonationSummary,
} from './donations';
import { CreateDonationRequest, Donation, DonationListItem, DonationSummary } from './types';

jest.mock('./client');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createDonation', () => {
  it('calls post with correct endpoint and request', async () => {
    const request: CreateDonationRequest = {
      amount: 100,
      campaignId: 'campaign1',
      organizationId: 'org1',
      isAnonymous: false,
      paymentMethod: 'card',
    };
    const mockDonation: Donation = {
      id: 'donation1',
      userId: 'user1',
      campaignId: 'campaign1',
      organizationId: 'org1',
      amount: 100,
      status: 'completed',
      paymentMethod: 'card',
      isAnonymous: false,
      receiptSent: false,
      createdAt: '2025-01-18T00:00:00Z',
      updatedAt: '2025-01-18T00:00:00Z',
    };

    (client.post as jest.Mock).mockResolvedValue(mockDonation);

    const result = await createDonation(request, 'token123');

    expect(result).toEqual(mockDonation);
  });

  it('passes token to post method', async () => {
    const request: CreateDonationRequest = {
      amount: 100,
      campaignId: 'campaign1',
      organizationId: 'org1',
      isAnonymous: false,
      paymentMethod: 'card',
    };

    (client.post as jest.Mock).mockResolvedValue({});

    await createDonation(request, 'token123');

    expect(client.post).toHaveBeenCalledWith('/api/donations', request, 'token123');
  });
});

describe('getDonationById', () => {
  it('calls get with correct endpoint', async () => {
    const mockDonation: Donation = {
      id: 'donation1',
      userId: 'user1',
      campaignId: 'campaign1',
      organizationId: 'org1',
      amount: 100,
      status: 'completed',
      isAnonymous: false,
      receiptSent: false,
      createdAt: '2025-01-18T00:00:00Z',
      updatedAt: '2025-01-18T00:00:00Z',
    };

    (client.get as jest.Mock).mockResolvedValue(mockDonation);

    const result = await getDonationById('donation1');

    expect(result).toEqual(mockDonation);
  });

  it('uses correct API endpoint format', async () => {
    (client.get as jest.Mock).mockResolvedValue({});

    await getDonationById('donation123');

    expect(client.get).toHaveBeenCalledWith('/api/donations/donation123');
  });
});

describe('getUserDonations', () => {
  it('calls getWithAuth with default pagination', async () => {
    const mockDonations: DonationListItem[] = [
      {
        id: 'donation1',
        amount: 100,
        status: 'completed',
        campaignTitle: 'Campaign 1',
        organizationName: 'Org 1',
        createdAt: '2025-01-18T00:00:00Z',
      },
    ];

    (client.getWithAuth as jest.Mock).mockResolvedValue(mockDonations);

    const result = await getUserDonations('user1', 'token123');

    expect(result).toEqual(mockDonations);
  });

  it('passes token and pagination to getWithAuth', async () => {
    (client.getWithAuth as jest.Mock).mockResolvedValue([]);

    await getUserDonations('user1', 'token123', 2, 50);

    expect(client.getWithAuth).toHaveBeenCalledWith('/api/donations/user/user1', 'token123', {
      page: 2,
      pageSize: 50,
    });
  });

  it('uses default pagination values when not provided', async () => {
    (client.getWithAuth as jest.Mock).mockResolvedValue([]);

    await getUserDonations('user1', 'token123');

    expect(client.getWithAuth).toHaveBeenCalledWith('/api/donations/user/user1', 'token123', {
      page: 1,
      pageSize: 20,
    });
  });
});

describe('getCampaignDonations', () => {
  it('calls get with correct endpoint', async () => {
    const mockDonations: DonationListItem[] = [
      {
        id: 'donation1',
        amount: 100,
        status: 'completed',
        campaignTitle: 'Campaign 1',
        organizationName: 'Org 1',
        createdAt: '2025-01-18T00:00:00Z',
      },
    ];

    (client.get as jest.Mock).mockResolvedValue(mockDonations);

    const result = await getCampaignDonations('campaign1');

    expect(result).toEqual(mockDonations);
  });

  it('includes pagination parameters', async () => {
    (client.get as jest.Mock).mockResolvedValue([]);

    await getCampaignDonations('campaign1', 2, 30);

    expect(client.get).toHaveBeenCalledWith('/api/donations/campaign/campaign1', {
      page: 2,
      pageSize: 30,
    });
  });

  it('uses default pagination when not provided', async () => {
    (client.get as jest.Mock).mockResolvedValue([]);

    await getCampaignDonations('campaign1');

    expect(client.get).toHaveBeenCalledWith('/api/donations/campaign/campaign1', {
      page: 1,
      pageSize: 20,
    });
  });
});

describe('getCampaignDonationSummary', () => {
  it('calls get with correct endpoint', async () => {
    const mockSummary: DonationSummary = {
      totalDonations: 10,
      totalAmount: 1000,
      averageDonation: 100,
    };

    (client.get as jest.Mock).mockResolvedValue(mockSummary);

    const result = await getCampaignDonationSummary('campaign1');

    expect(result).toEqual(mockSummary);
  });

  it('uses correct API endpoint format', async () => {
    (client.get as jest.Mock).mockResolvedValue({});

    await getCampaignDonationSummary('campaign123');

    expect(client.get).toHaveBeenCalledWith('/api/donations/campaign/campaign123/summary');
  });
});
