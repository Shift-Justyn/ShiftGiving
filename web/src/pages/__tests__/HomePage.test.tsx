import { render, screen } from '@testing-library/react';
import { HomePage } from '../HomePage';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { CartProvider } from '../../context/CartContext';
import { BrowserRouter } from 'react-router-dom';
import * as campaignsApi from '../../api/campaigns';

jest.mock('../../api/campaigns');

const mockCampaignsApi = campaignsApi as jest.Mocked<typeof campaignsApi>;

beforeEach(() => {
  mockCampaignsApi.getCampaigns.mockResolvedValue([]);
  mockCampaignsApi.getOrganizations.mockResolvedValue([]);
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>{ui}</CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  it('renders welcome header', async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText('Discover campaigns and causes you care about')).toBeInTheDocument();
  });

  it('renders campaigns section', async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText('Campaigns')).toBeInTheDocument();
  });

  it('renders organizations section', async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getAllByText('Organizations').length).toBeGreaterThan(0);
  });

  it('renders bottom navigation', async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders search placeholder', async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByPlaceholderText('Search for a charity or nonprofit')).toBeInTheDocument();
  });
});
