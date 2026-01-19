import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DonationPage } from '../DonationPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import * as campaignApi from '../../api/campaigns';

jest.mock('../../api/campaigns');

const mockCampaign = {
  id: 'campaign-123',
  title: 'Test Campaign',
  name: 'Test Campaign',
  description: 'A test campaign',
  shortDescription: 'Short description',
  goalAmount: 10000,
  raisedAmount: 5000,
  status: 'active',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  featuredImageUrl: null,
  videoUrl: null,
  organization: {
    id: 'org-123',
    name: 'Test Organization',
    logoUrl: null,
    description: 'Test org description',
  },
};

const renderDonationPage = () => {
  window.history.pushState({}, '', '/campaigns/campaign-123/donate');
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/campaigns/:id/donate" element={<DonationPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('DonationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (campaignApi.getCampaignById as jest.Mock).mockResolvedValue(mockCampaign);
  });

  it('renders the donation form', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getAllByText('Test Campaign').length).toBeGreaterThan(0);
    });
  });

  it('displays preset amount buttons', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '$50' })).toBeInTheDocument();
    });
  });

  it('allows entering a custom amount', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument();
    });
  });

  it('selects a preset amount when clicked', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '$50' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '$50' }));

    const input = screen.getByPlaceholderText('Enter amount') as HTMLInputElement;
    expect(input.value).toBe('50');
  });

  it('has an anonymous donation toggle', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByText(/make my donation anonymous/i)).toBeInTheDocument();
    });
  });

  it('has a message field', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/supporting this cause/i)).toBeInTheDocument();
    });
  });

  it('has a continue to payment button', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue to payment/i })).toBeInTheDocument();
    });
  });

  it('displays preset amount of $50', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '$50' })).toBeInTheDocument();
    });
  });

  it('displays preset amount of $100', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '$100' })).toBeInTheDocument();
    });
  });

  it('displays preset amount of $150', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '$150' })).toBeInTheDocument();
    });
  });

  it('displays preset amount of $200', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '$200' })).toBeInTheDocument();
    });
  });

  it('displays Enter Here label for custom amount', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByText('Enter Here')).toBeInTheDocument();
    });
  });

  it('displays question about donation amount', async () => {
    renderDonationPage();

    await waitFor(() => {
      expect(screen.getByText('How much do you want to donate?')).toBeInTheDocument();
    });
  });
});
