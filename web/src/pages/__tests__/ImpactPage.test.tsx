import { render, screen, waitFor } from '@testing-library/react';
import { ImpactPage } from '../ImpactPage';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { mockTheme } from '../../test-utils/theme';
import * as donationsApi from '../../api/donations';
import { DonationListItem } from '../../api/types';

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      userType: 'donor',
      avatarUrl: null,
    },
    token: 'test-token',
    isAuthenticated: true,
    isLoading: false,
  }),
}));

jest.mock('../../api/donations');
jest.mock('../../components/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

const mockDonationsApi = donationsApi as jest.Mocked<typeof donationsApi>;

const mockDonations: DonationListItem[] = [
  {
    id: 'donation-1',
    amount: 50,
    status: 'completed',
    campaignTitle: 'Animal Shelter Support',
    organizationName: 'Local Animal Rescue',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'donation-2',
    amount: 100,
    status: 'completed',
    campaignTitle: 'Community Food Bank',
    organizationName: 'City Food Bank',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'donation-3',
    amount: 75,
    status: 'completed',
    campaignTitle: 'Education Fund',
    organizationName: 'School District',
    createdAt: '2026-01-05T10:00:00Z',
  },
];

const renderImpactPage = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={mockTheme}>
        <ImpactPage />
      </ThemeProvider>
    </BrowserRouter>
  );
};

beforeEach(() => {
  mockDonationsApi.getUserDonations.mockResolvedValue([]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ImpactPage', () => {
  it('renders page title', () => {
    renderImpactPage();

    expect(screen.getByText('My Impact')).toBeInTheDocument();
  });

  it('renders page subtitle', () => {
    renderImpactPage();

    expect(screen.getByText('See how your donations are making a difference')).toBeInTheDocument();
  });

  it('renders sidebar component', () => {
    renderImpactPage();

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderImpactPage();

    expect(screen.getByText('Loading your impact data...')).toBeInTheDocument();
  });

  it('calls getUserDonations with correct parameters', async () => {
    renderImpactPage();

    await waitFor(() => {
      expect(mockDonationsApi.getUserDonations).toHaveBeenCalledWith('user-123', 'test-token');
    });
  });

  it('displays total donated amount', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('$225')).toBeInTheDocument();
    });
  });

  it('displays campaigns supported count', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      const campaignsCard = screen.getByText('Campaigns Supported').parentElement;
      expect(campaignsCard).toHaveTextContent('3');
    });
  });

  it('displays organizations helped count', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      const orgsCard = screen.getByText('Organizations Helped').parentElement;
      expect(orgsCard).toHaveTextContent('3');
    });
  });

  it('displays donation count', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      const donationsCard = screen.getByText('Total Donations').parentElement;
      expect(donationsCard).toHaveTextContent('3');
    });
  });

  it('displays total donated label', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Total Donated')).toBeInTheDocument();
    });
  });

  it('displays campaigns supported label', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Campaigns Supported')).toBeInTheDocument();
    });
  });

  it('displays organizations helped label', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Organizations Helped')).toBeInTheDocument();
    });
  });

  it('displays total donations label', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Total Donations')).toBeInTheDocument();
    });
  });

  it('displays recent contributions section title', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Recent Contributions')).toBeInTheDocument();
    });
  });

  it('displays empty state when no donations exist', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue([]);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('No donations yet')).toBeInTheDocument();
    });
  });

  it('displays empty state message', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue([]);
    renderImpactPage();

    await waitFor(() => {
      expect(
        screen.getByText('Start making an impact by supporting campaigns you care about')
      ).toBeInTheDocument();
    });
  });

  it('displays first donation campaign title', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Animal Shelter Support')).toBeInTheDocument();
    });
  });

  it('displays first donation organization name', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Local Animal Rescue')).toBeInTheDocument();
    });
  });

  it('displays first donation amount', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      const firstDonation = screen.getByText('Animal Shelter Support').parentElement?.parentElement;
      expect(firstDonation).toHaveTextContent('$50');
    });
  });

  it('displays first donation date', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Jan 15, 2026')).toBeInTheDocument();
    });
  });

  it('displays second donation campaign title', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
    });
  });

  it('displays third donation campaign title', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Education Fund')).toBeInTheDocument();
    });
  });

  it('displays impact by category section title', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Impact by Category')).toBeInTheDocument();
    });
  });

  it('displays animals category', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Animals')).toBeInTheDocument();
    });
  });

  it('displays community category', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Community')).toBeInTheDocument();
    });
  });

  it('displays education category', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Education')).toBeInTheDocument();
    });
  });

  it('displays health category', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Health')).toBeInTheDocument();
    });
  });

  it('displays environment category', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Environment')).toBeInTheDocument();
    });
  });

  it('calculates animals category amount correctly', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      const animalsSection = screen.getByText('Animals').parentElement;
      expect(animalsSection).toHaveTextContent('$50');
    });
  });

  it('calculates community category amount correctly', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      const communitySection = screen.getByText('Community').parentElement;
      expect(communitySection).toHaveTextContent('$100');
    });
  });

  it('calculates education category amount correctly', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      const educationSection = screen.getByText('Education').parentElement;
      expect(educationSection).toHaveTextContent('$75');
    });
  });

  it('shows zero for health category when no matching donations', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      const healthSection = screen.getByText('Health').parentElement;
      expect(healthSection).toHaveTextContent('$0');
    });
  });

  it('shows zero for environment category when no matching donations', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      const environmentSection = screen.getByText('Environment').parentElement;
      expect(environmentSection).toHaveTextContent('$0');
    });
  });

  it('limits donation list to 10 items', async () => {
    const manyDonations = Array.from({ length: 15 }, (_, i) => ({
      id: `donation-${i}`,
      amount: 10,
      status: 'completed',
      campaignTitle: `Campaign ${i}`,
      organizationName: `Organization ${i}`,
      createdAt: '2026-01-01T10:00:00Z',
    }));
    mockDonationsApi.getUserDonations.mockResolvedValue(manyDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Campaign 0')).toBeInTheDocument();
    });

    expect(screen.getByText('Campaign 9')).toBeInTheDocument();
  });

  it('does not display 11th donation when more than 10 exist', async () => {
    const manyDonations = Array.from({ length: 15 }, (_, i) => ({
      id: `donation-${i}`,
      amount: 10,
      status: 'completed',
      campaignTitle: `Campaign ${i}`,
      organizationName: `Organization ${i}`,
      createdAt: '2026-01-01T10:00:00Z',
    }));
    mockDonationsApi.getUserDonations.mockResolvedValue(manyDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.getByText('Campaign 0')).toBeInTheDocument();
    });

    expect(screen.queryByText('Campaign 10')).not.toBeInTheDocument();
  });

  it('calculates unique campaigns correctly', async () => {
    const duplicateCampaignDonations = [
      {
        id: 'donation-1',
        amount: 50,
        status: 'completed',
        campaignTitle: 'Same Campaign',
        organizationName: 'Organization A',
        createdAt: '2026-01-01T10:00:00Z',
      },
      {
        id: 'donation-2',
        amount: 75,
        status: 'completed',
        campaignTitle: 'Same Campaign',
        organizationName: 'Organization B',
        createdAt: '2026-01-02T10:00:00Z',
      },
    ];
    mockDonationsApi.getUserDonations.mockResolvedValue(duplicateCampaignDonations);
    renderImpactPage();

    await waitFor(() => {
      const campaignsSupportedCard = screen.getByText('Campaigns Supported').parentElement;
      expect(campaignsSupportedCard).toHaveTextContent('1');
    });
  });

  it('calculates unique organizations correctly', async () => {
    const duplicateOrgDonations = [
      {
        id: 'donation-1',
        amount: 50,
        status: 'completed',
        campaignTitle: 'Campaign A',
        organizationName: 'Same Organization',
        createdAt: '2026-01-01T10:00:00Z',
      },
      {
        id: 'donation-2',
        amount: 75,
        status: 'completed',
        campaignTitle: 'Campaign B',
        organizationName: 'Same Organization',
        createdAt: '2026-01-02T10:00:00Z',
      },
    ];
    mockDonationsApi.getUserDonations.mockResolvedValue(duplicateOrgDonations);
    renderImpactPage();

    await waitFor(() => {
      const organizationsHelpedCard = screen.getByText('Organizations Helped').parentElement;
      expect(organizationsHelpedCard).toHaveTextContent('1');
    });
  });

  it('hides loading state after data loads', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue(mockDonations);
    renderImpactPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading your impact data...')).not.toBeInTheDocument();
    });
  });

  it('formats currency without decimal places', async () => {
    const donationWithCents = [
      {
        id: 'donation-1',
        amount: 50.99,
        status: 'completed',
        campaignTitle: 'Test Campaign',
        organizationName: 'Test Org',
        createdAt: '2026-01-01T10:00:00Z',
      },
    ];
    mockDonationsApi.getUserDonations.mockResolvedValue(donationWithCents);
    renderImpactPage();

    await waitFor(() => {
      const totalCard = screen.getByText('Total Donated').parentElement;
      expect(totalCard).toHaveTextContent('$51');
    });
  });

  it('handles API error gracefully', async () => {
    mockDonationsApi.getUserDonations.mockRejectedValue(new Error('API Error'));
    renderImpactPage();

    await waitFor(() => {
      expect(screen.queryByText('Loading your impact data...')).not.toBeInTheDocument();
    });
  });

  it('displays zero stats when API returns empty array', async () => {
    mockDonationsApi.getUserDonations.mockResolvedValue([]);
    renderImpactPage();

    await waitFor(() => {
      const totalCard = screen.getByText('Total Donated').parentElement;
      expect(totalCard).toHaveTextContent('$0');
    });
  });
});
