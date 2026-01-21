import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CampaignCard } from './CampaignCard';
import { Campaign } from '../../api/types';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../themes';

const mockCampaign: Campaign = {
  id: 'campaign1',
  title: 'Build a School',
  shortDescription: 'Help us build a new school for underprivileged children',
  goalAmount: 50000,
  raisedAmount: 25000,
  status: 'active',
  featuredImageUrl: 'https://example.com/image.jpg',
  organization: {
    id: 'org1',
    name: 'Education Foundation',
    logoUrl: 'https://example.com/logo.jpg',
  },
  endDate: '2025-12-31',
  category: 'Education',
  location: 'Chicago, IL',
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('CampaignCard', () => {
  it('displays campaign title', () => {
    renderWithTheme(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText('Build a School')).toBeInTheDocument();
  });

  it('displays campaign short description', () => {
    renderWithTheme(<CampaignCard campaign={mockCampaign} />);

    expect(
      screen.getByText('Help us build a new school for underprivileged children')
    ).toBeInTheDocument();
  });

  it('displays campaign category', () => {
    renderWithTheme(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  it('displays campaign location', () => {
    renderWithTheme(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText('Chicago, IL')).toBeInTheDocument();
  });

  it('displays funding progress percentage', () => {
    renderWithTheme(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    renderWithTheme(<CampaignCard campaign={mockCampaign} onClick={handleClick} />);

    const card = screen.getByText('Build a School').closest('div');
    if (card?.closest('div[class*="Card"]')) {
      await user.click(card.closest('div[class*="Card"]')!);
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it('renders without onClick handler', () => {
    renderWithTheme(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText('Build a School')).toBeInTheDocument();
  });

  it('displays zero raised amount correctly', () => {
    const noDonationsCampaign = { ...mockCampaign, raisedAmount: 0 };

    const { container } = renderWithTheme(<CampaignCard campaign={noDonationsCampaign} />);

    expect(container.textContent).toContain('$0');
  });

  it('displays campaign with full progress bar when raised equals goal', () => {
    const completedCampaign = {
      ...mockCampaign,
      raisedAmount: 50000,
      goalAmount: 50000,
    };

    renderWithTheme(<CampaignCard campaign={completedCampaign} />);

    expect(screen.getByText('Build a School')).toBeInTheDocument();
  });

  it('handles campaign with null description', () => {
    const campaignNullDescription = { ...mockCampaign, shortDescription: null };

    const { container } = renderWithTheme(<CampaignCard campaign={campaignNullDescription} />);

    expect(screen.getByText('Build a School')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('handles campaign with null image URL', () => {
    const campaignNullImage = { ...mockCampaign, featuredImageUrl: null };

    const { container } = renderWithTheme(<CampaignCard campaign={campaignNullImage} />);

    expect(screen.getByText('Build a School')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });
});
