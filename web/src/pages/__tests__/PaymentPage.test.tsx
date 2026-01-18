import { render, screen, waitFor } from '@testing-library/react';
import { PaymentPage } from '../PaymentPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

const mockLocationState = {
  amount: 100,
  isAnonymous: false,
  message: 'Test message',
  campaignId: 'campaign-123',
  organizationId: 'org-123',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: mockLocationState,
  }),
}));

const renderPaymentPage = () => {
  window.history.pushState({}, '', '/campaigns/campaign-123/donate/payment');
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/campaigns/:id/donate/payment" element={<PaymentPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('PaymentPage', () => {
  it('renders payment form', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByText('Payment Information')).toBeInTheDocument();
    });
  });

  it('displays order summary with amount', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getAllByText('$100.00').length).toBeGreaterThan(0);
    });
  });

  it('has card number input', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    });
  });

  it('has expiry date input', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/expiry/i)).toBeInTheDocument();
    });
  });

  it('has CVV input', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
    });
  });

  it('has complete donation button', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /complete donation/i })).toBeInTheDocument();
    });
  });
});
