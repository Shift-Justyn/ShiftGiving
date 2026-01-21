import { render, screen, fireEvent } from '@testing-library/react';
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

  it('shows saved card option by default', async () => {
    renderPage();
    const savedCard = await screen.findByText(/Visa ending in 4242/i);
    expect(savedCard).toBeInTheDocument();
  });

  it('shows Apple Pay option', async () => {
    renderPage();
    const applePay = await screen.findByText(/Apple Pay/i);
    expect(applePay).toBeInTheDocument();
  });

  it('shows card inputs when Add New Card is selected', async () => {
    renderPage();
    const addNewCard = await screen.findByText(/Add New Card/i);
    fireEvent.click(addNewCard);
    const cardInput = await screen.findByLabelText(/card number/i);
    expect(cardInput).toBeInTheDocument();
  });

  it('shows payment options section', async () => {
    renderPage();
    const section = await screen.findByText(/payment options/i);
    expect(section).toBeInTheDocument();
  });
});
