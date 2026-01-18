import { render, screen, waitFor } from '@testing-library/react';
import { DonationConfirmationPage } from '../DonationConfirmationPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
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
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/donations/:id/confirmation" element={<DonationConfirmationPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('DonationConfirmationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (donationApi.getDonationById as jest.Mock).mockResolvedValue(mockDonation);
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
});
