import { http, HttpResponse } from 'msw';
import { users, organizations, campaigns, campaignDetails, donations } from './data';
import {
  AuthLoginResponse,
  Campaign,
  CampaignDetail,
  Organization,
  Donation,
  DonationListItem,
  DonationSummary,
  AuthUser,
} from '../api/types';

const API_BASE_URL = 'http://localhost:5237';

interface ApiWrapper<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
}

const wrapResponse = <T>(data: T): ApiWrapper<T> => ({
  success: true,
  data,
  error: null,
});

const wrapError = (code: string, message: string) => ({
  success: false,
  data: null,
  error: { code, message },
});

export const handlers = [
  http.post(`${API_BASE_URL}/api/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = users[body.email];

    if (!user || user.password !== body.password) {
      return HttpResponse.json(wrapError('INVALID_CREDENTIALS', 'Invalid email or password'), {
        status: 401,
      });
    }

    const { password: _password, ...userWithoutPassword } = user;
    const response: AuthLoginResponse = {
      user: userWithoutPassword as AuthUser,
      token: `mock-token-${user.id}`,
      refreshToken: `mock-refresh-token-${user.id}`,
    };

    return HttpResponse.json(wrapResponse(response));
  }),

  http.post(`${API_BASE_URL}/api/auth/register`, async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };

    if (users[body.email]) {
      return HttpResponse.json(wrapError('EMAIL_EXISTS', 'Email already registered'), {
        status: 400,
      });
    }

    return HttpResponse.json(wrapResponse(null));
  }),

  http.get(`${API_BASE_URL}/api/campaigns`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const featured = url.searchParams.get('featured') === 'true';

    let filtered = [...campaigns];
    if (featured) {
      filtered = filtered.slice(0, 4);
    }

    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    return HttpResponse.json(wrapResponse<Campaign[]>(paged));
  }),

  http.get(`${API_BASE_URL}/api/campaigns/:id`, ({ params }) => {
    const campaignDetail = campaignDetails[params.id as string];
    if (!campaignDetail) {
      return HttpResponse.json(wrapError('NOT_FOUND', 'Campaign not found'), { status: 404 });
    }

    return HttpResponse.json(wrapResponse<CampaignDetail>(campaignDetail));
  }),

  http.get(`${API_BASE_URL}/api/organizations`, () => {
    return HttpResponse.json(wrapResponse<Organization[]>(organizations));
  }),

  http.get(`${API_BASE_URL}/api/organizations/:id`, ({ params }) => {
    const organization = organizations.find((org) => org.id === params.id);
    if (!organization) {
      return HttpResponse.json(wrapError('NOT_FOUND', 'Organization not found'), { status: 404 });
    }

    return HttpResponse.json(wrapResponse<Organization>(organization));
  }),

  http.post(`${API_BASE_URL}/api/donations`, async ({ request }) => {
    const body = (await request.json()) as {
      amount: number;
      campaignId: string;
      organizationId: string;
      isAnonymous: boolean;
      donorMessage?: string;
      paymentMethod: string;
    };

    const donation: Donation = {
      id: `donation-${Date.now()}`,
      userId: 'user-1',
      campaignId: body.campaignId,
      organizationId: body.organizationId,
      amount: body.amount,
      status: 'Completed',
      paymentMethod: body.paymentMethod,
      isAnonymous: body.isAnonymous,
      donorMessage: body.donorMessage,
      receiptSent: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(wrapResponse<Donation>(donation));
  }),

  http.get(`${API_BASE_URL}/api/donations/user/:userId`, ({ params, request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');

    const userDonations = donations.filter((d) => d.userId === params.userId);
    const start = (page - 1) * pageSize;
    const paged = userDonations.slice(start, start + pageSize);

    const result: DonationListItem[] = paged.map((d) => {
      const campaign = campaigns.find((c) => c.id === d.campaignId);
      const org = organizations.find((o) => o.id === d.organizationId);
      return {
        id: d.id,
        amount: d.amount,
        status: d.status,
        campaignTitle: campaign?.title || 'Unknown Campaign',
        organizationName: org?.name || 'Unknown Organization',
        createdAt: d.createdAt,
      };
    });

    return HttpResponse.json(wrapResponse<DonationListItem[]>(result));
  }),

  http.get(`${API_BASE_URL}/api/donations/campaign/:campaignId`, ({ params, request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');

    const campaignDonations = donations.filter((d) => d.campaignId === params.campaignId);
    const start = (page - 1) * pageSize;
    const paged = campaignDonations.slice(start, start + pageSize);

    const result: DonationListItem[] = paged.map((d) => {
      const campaign = campaigns.find((c) => c.id === d.campaignId);
      const org = organizations.find((o) => o.id === d.organizationId);
      return {
        id: d.id,
        amount: d.amount,
        status: d.status,
        campaignTitle: campaign?.title || 'Unknown Campaign',
        organizationName: org?.name || 'Unknown Organization',
        createdAt: d.createdAt,
      };
    });

    return HttpResponse.json(wrapResponse<DonationListItem[]>(result));
  }),

  http.get(`${API_BASE_URL}/api/donations/campaign/:campaignId/summary`, ({ params }) => {
    const campaignDonations = donations.filter((d) => d.campaignId === params.campaignId);
    const totalAmount = campaignDonations.reduce((sum, d) => sum + d.amount, 0);

    const summary: DonationSummary = {
      totalDonations: campaignDonations.length,
      totalAmount,
      averageDonation: campaignDonations.length > 0 ? totalAmount / campaignDonations.length : 0,
    };

    return HttpResponse.json(wrapResponse<DonationSummary>(summary));
  }),

  http.get(`${API_BASE_URL}/api/donations/:id`, ({ params }) => {
    const donation = donations.find((d) => d.id === params.id);
    if (!donation) {
      return HttpResponse.json(wrapError('NOT_FOUND', 'Donation not found'), { status: 404 });
    }

    return HttpResponse.json(wrapResponse<Donation>(donation));
  }),
];
