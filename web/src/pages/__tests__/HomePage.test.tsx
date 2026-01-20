import { render, screen } from '@testing-library/react';
import { HomePage } from '../HomePage';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
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

describe('HomePage', () => {
  it('renders featured campaigns header', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Featured Campaigns')).toBeInTheDocument();
  });

  it('renders campaigns section', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Campaigns')).toBeInTheDocument();
  });

  it('renders organizations section', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText('Organizations').length).toBeGreaterThan(0);
  });

  it('renders bottom navigation', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders search placeholder', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Search for a charity or nonprofit')).toBeInTheDocument();
  });
});
