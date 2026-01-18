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

describe('HomePage', () => {
  it('renders welcome heading', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome to Shift Giving')).toBeInTheDocument();
  });
});
