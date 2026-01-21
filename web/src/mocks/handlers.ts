import { http, HttpResponse } from 'msw';
import { users, organizations, campaigns, campaignDetails, donations, mediaAssets } from './data';
import {
  AuthLoginResponse,
  Campaign,
  CampaignDetail,
  Organization,
  Donation,
  DonationListItem,
  DonationSummary,
  AuthUser,
  MediaAsset,
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

  http.get(`${API_BASE_URL}/api/media`, () => {
    return HttpResponse.json(wrapResponse<MediaAsset[]>(mediaAssets));
  }),

  http.post(`${API_BASE_URL}/api/media/upload`, async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      name: 'Uploaded Image',
      url: '/images/media/gallery-donation-collection.jpg',
      type: 'image',
      size: '2.1 MB',
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(wrapResponse<MediaAsset>(newAsset));
  }),

  http.post(`${API_BASE_URL}/api/media/generate`, async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      name: 'AI Generated Image',
      url: '/images/campaigns/campaign-5-food-distribution.jpg',
      type: 'image',
      size: '2.8 MB',
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(wrapResponse<MediaAsset>(generatedAsset));
  }),

  http.delete(`${API_BASE_URL}/api/media/:id`, ({ params }) => {
    const asset = mediaAssets.find((m) => m.id === params.id);
    if (!asset) {
      return HttpResponse.json(wrapError('NOT_FOUND', 'Media asset not found'), { status: 404 });
    }

    return HttpResponse.json(wrapResponse<null>(null));
  }),

  http.post(`${API_BASE_URL}/api/ai/generate-image`, async ({ request }) => {
    const body = (await request.json()) as { prompt: string; originalPrompt: string };

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockImages = [
      '/images/media/gallery-volunteers.jpg',
      '/images/campaigns/campaign-5-food-distribution.jpg',
      '/images/media/gallery-community-support.jpg',
      '/images/media/gallery-donation-collection.jpg',
      '/images/media/gallery-animal-care.jpg',
      '/images/campaigns/campaign-7-youth-tech.jpg',
    ];

    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];

    return HttpResponse.json(
      wrapResponse({
        url: randomImage,
        prompt: body.prompt,
        revisedPrompt: body.prompt,
      })
    );
  }),

  http.post(`${API_BASE_URL}/api/ai/enhance-text`, async ({ request }) => {
    const body = (await request.json()) as {
      text: string;
      field: string;
      action: string;
    };

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const enhancedTexts: Record<string, Record<string, string>> = {
      fix_grammar: {
        description: body.text,
        teaser: body.text,
        story: body.text,
      },
      improve: {
        description: `${body.text} Our dedicated team works tirelessly to make a difference.`,
        teaser: `${body.text} Join us in creating lasting change in our community.`,
        story: `${body.text}\n\nEvery contribution helps us reach more families and create lasting impact in our community. Together, we can build a brighter future.`,
      },
      rewrite: {
        description: 'Making a difference, one donation at a time. Join our mission today.',
        teaser:
          'Your generosity transforms lives. See the impact of community-driven change and become part of something bigger.',
        story:
          'Every day, countless families face challenges that seem insurmountable. But with your support, we provide hope, resources, and a path forward. Our dedicated volunteers and staff work around the clock to ensure every donation reaches those who need it most.',
      },
      tone: {
        description: body.text,
        teaser: body.text,
        story: body.text,
      },
      expand: {
        description: body.text,
        teaser: body.text,
        story: `${body.text}\n\nOur impact extends far beyond numbers. Each statistic represents a real person, a real family, a real story of transformation. When you donate, you become part of this story.\n\nLast year alone, we served over 5,000 families, distributed 50,000 meals, and provided essential resources to those in need. But we know there is more work to be done.`,
      },
    };

    const enhanced = enhancedTexts[body.action]?.[body.field] || body.text;

    return HttpResponse.json(
      wrapResponse({
        text: enhanced,
        originalText: body.text,
      })
    );
  }),
];
