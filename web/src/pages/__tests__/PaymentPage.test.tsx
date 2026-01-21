import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('shows saved card option by default', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByText(/Visa ending in 4242/i)).toBeInTheDocument();
    });
  });

  it('shows Apple Pay option', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByText(/Apple Pay/i)).toBeInTheDocument();
    });
  });

  it('has card number input when Add New Card is selected', async () => {
    const user = userEvent.setup();
    renderPaymentPage();

    const addNewCard = await screen.findByText(/Add New Card/i);
    await user.click(addNewCard);

    await waitFor(() => {
      expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    });
  });

  it('has complete donation button', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /complete donation/i })).toBeInTheDocument();
    });
  });

  it('has cover transaction fees checkbox', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/cover transaction fees/i)).toBeInTheDocument();
    });
  });

  it('displays transaction fee amount', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByText(/\$3\.40/)).toBeInTheDocument();
    });
  });

  it('has recurring transaction checkbox', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/recurring transaction/i)).toBeInTheDocument();
    });
  });

  it('has email receipt checkbox', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/email me a receipt/i)).toBeInTheDocument();
    });
  });

  it('displays transaction ID', async () => {
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getByText(/transaction id/i)).toBeInTheDocument();
    });
  });

  it('updates total when cover fees checkbox is toggled', async () => {
    const user = userEvent.setup();
    renderPaymentPage();

    await waitFor(() => {
      expect(screen.getAllByText('$100.00').length).toBeGreaterThan(0);
    });

    const checkbox = screen.getByLabelText(/cover transaction fees/i);
    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText('$103.40')).toBeInTheDocument();
    });
  });

  it('shows recurring dropdown when recurring checkbox is checked', async () => {
    const user = userEvent.setup();
    renderPaymentPage();

    const checkbox = await screen.findByLabelText(/recurring transaction/i);
    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('email receipt checkbox is checked by default', async () => {
    renderPaymentPage();

    await waitFor(() => {
      const checkbox = screen.getByLabelText(/email me a receipt/i) as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });
  });
});
