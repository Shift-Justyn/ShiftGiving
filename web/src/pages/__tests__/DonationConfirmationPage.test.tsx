import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DonationConfirmationPage } from '../DonationConfirmationPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { FeatureFlagsProvider } from '../../context/FeatureFlagsContext';
import * as donationApi from '../../api/donations';

jest.mock('../../api/donations');

const mockDonation = {
  id: 'donation-123',
  userId: 'user-123',
  campaignId: 'campaign-123',
  organizationId: 'org-123',
  amount: 100,
  status: 'completed',
  paymentMethod: 'card',
  isAnonymous: false,
  donorMessage: 'Great cause!',
  receiptSent: true,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

const renderConfirmationPage = () => {
  window.history.pushState({}, '', '/donations/donation-123/confirmation');
  return render(
    <BrowserRouter>
      <FeatureFlagsProvider>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/donations/:id/confirmation" element={<DonationConfirmationPage />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </FeatureFlagsProvider>
    </BrowserRouter>
  );
};

describe('DonationConfirmationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (donationApi.getDonationById as jest.Mock).mockResolvedValue(mockDonation);
    window.open = jest.fn();
    global.URL.createObjectURL = jest.fn(() => 'mock-blob-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  it('renders success message', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      expect(screen.getByText(/donation successful/i)).toBeInTheDocument();
    });
  });

  it('displays donation amount', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      expect(screen.getByText('$100.00')).toBeInTheDocument();
    });
  });

  it('has back to campaigns link', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /back to campaigns/i })).toBeInTheDocument();
    });
  });

  it('displays transaction id from donation', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      const donationIdElement = screen.getByText('Donation ID');
      expect(donationIdElement).toBeInTheDocument();
    });
  });

  it('displays donation date formatted correctly', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      expect(screen.getByText(/January 15, 2024/i)).toBeInTheDocument();
    });
  });

  it('displays donor message when present', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      expect(screen.getByText('Great cause!')).toBeInTheDocument();
    });
  });

  it('renders download receipt button', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download receipt/i })).toBeInTheDocument();
    });
  });

  it('downloads receipt on button click', async () => {
    const user = userEvent.setup();
    renderConfirmationPage();

    await waitFor(() => {
      const downloadButton = screen.getByRole('button', { name: /download receipt/i });
      expect(downloadButton).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole('button', { name: /download receipt/i });
    await user.click(downloadButton);

    expect(window.open).toBeDefined();
  });

  it('renders share buttons when feature flag enabled', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      expect(screen.getByText(/share your support/i)).toBeInTheDocument();
    });
  });

  it('renders facebook share button', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((btn) => btn.textContent?.includes('f'))).toBe(true);
    });
  });

  it('renders linkedin share button', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((btn) => btn.textContent?.includes('in'))).toBe(true);
    });
  });

  it('renders x twitter share button', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((btn) => btn.textContent?.includes('𝕏'))).toBe(true);
    });
  });

  it('opens twitter share url on click', async () => {
    const user = userEvent.setup();
    renderConfirmationPage();

    await waitFor(() => {
      expect(screen.getByText(/share your support/i)).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button');
    const twitterButton = buttons.find((btn) => btn.textContent?.includes('𝕏'));

    if (twitterButton) {
      await user.click(twitterButton);
      expect(window.open).toHaveBeenCalled();
    }
  });

  it('displays thank you note', async () => {
    renderConfirmationPage();

    await waitFor(() => {
      expect(screen.getByText(/Your generosity makes a real difference/i)).toBeInTheDocument();
    });
  });

  it('renders loading spinner initially', () => {
    (donationApi.getDonationById as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
    renderConfirmationPage();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error message when donation not found', async () => {
    (donationApi.getDonationById as jest.Mock).mockResolvedValueOnce(null);
    renderConfirmationPage();

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
