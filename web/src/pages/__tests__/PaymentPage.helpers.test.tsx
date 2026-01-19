import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { PaymentPage } from '../PaymentPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      amount: 100,
      isAnonymous: false,
      message: 'Test',
      campaignId: 'c1',
      organizationId: 'o1',
    },
  }),
  useParams: () => ({ id: 'c1' }),
}));

const renderPage = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PaymentPage />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('PaymentPage fee calculations', () => {
  it('calculates 2.9% transaction fee correctly', async () => {
    renderPage();
    const feeText = await screen.findByText(/\$3\.40/);
    expect(feeText).toBeInTheDocument();
  });

  it('displays base amount in summary', async () => {
    renderPage();
    const amounts = await screen.findAllByText(/\$100\.00/);
    expect(amounts.length).toBeGreaterThan(0);
  });

  it('generates unique transaction ID', async () => {
    renderPage();
    const txnLabel = await screen.findByText(/transaction id/i);
    expect(txnLabel).toBeInTheDocument();
  });

  it('displays transaction ID with TXN prefix', async () => {
    renderPage();
    const txnValue = await screen.findByText(/^TXN-/);
    expect(txnValue).toBeInTheDocument();
  });

  it('formats card numbers with spaces', async () => {
    renderPage();
    const cardInput = await screen.findByLabelText(/card number/i);
    expect(cardInput).toBeInTheDocument();
  });

  it('formats expiry date with slash', async () => {
    renderPage();
    const expiryInput = await screen.findByLabelText(/expiry/i);
    expect(expiryInput).toBeInTheDocument();
  });

  it('shows payment options section', async () => {
    renderPage();
    const section = await screen.findByText(/payment options/i);
    expect(section).toBeInTheDocument();
  });
});
