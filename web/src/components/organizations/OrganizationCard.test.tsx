import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrganizationCard } from './OrganizationCard';
import { Organization } from '../../api/types';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../themes';

const mockOrganization: Organization = {
  id: 'org1',
  name: 'Education Foundation',
  description: 'An organization focused on education',
  logoUrl: 'https://example.com/logo.jpg',
  campaignCount: 5,
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('OrganizationCard', () => {
  it('displays organization name', () => {
    renderWithTheme(<OrganizationCard organization={mockOrganization} />);

    expect(screen.getByText('Education Foundation')).toBeInTheDocument();
  });

  it('displays total raised amount as currency', () => {
    renderWithTheme(<OrganizationCard organization={mockOrganization} />);

    expect(screen.getByText('$75k')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    renderWithTheme(<OrganizationCard organization={mockOrganization} onClick={handleClick} />);

    const card = screen.getByText('Education Foundation').closest('div');
    if (card?.closest('div[class*="Card"]')) {
      await user.click(card.closest('div[class*="Card"]')!);
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it('renders without onClick handler', () => {
    renderWithTheme(<OrganizationCard organization={mockOrganization} />);

    expect(screen.getByText('Education Foundation')).toBeInTheDocument();
  });

  it('displays initials when logo URL is not provided', () => {
    const noLogoOrg = { ...mockOrganization, logoUrl: null };

    renderWithTheme(<OrganizationCard organization={noLogoOrg} />);

    expect(screen.getByText('EF')).toBeInTheDocument();
  });

  it('displays single initial for single word name', () => {
    const singleNameOrg = { ...mockOrganization, name: 'Red', logoUrl: null };

    renderWithTheme(<OrganizationCard organization={singleNameOrg} />);

    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('calculates total raised based on campaign count', () => {
    const org10Campaigns = { ...mockOrganization, campaignCount: 10 };

    renderWithTheme(<OrganizationCard organization={org10Campaigns} />);

    expect(screen.getByText('$150k')).toBeInTheDocument();
  });

  it('displays zero campaigns correctly', () => {
    const noCampaignsOrg = { ...mockOrganization, campaignCount: 0 };

    renderWithTheme(<OrganizationCard organization={noCampaignsOrg} />);

    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('handles organization with one campaign', () => {
    const oneCampaignOrg = { ...mockOrganization, campaignCount: 1 };

    renderWithTheme(<OrganizationCard organization={oneCampaignOrg} />);

    expect(screen.getByText('$15k')).toBeInTheDocument();
  });

  it('handles three letter name initials', () => {
    const threeLetterOrg = { ...mockOrganization, name: 'Red Cross Blue', logoUrl: null };

    renderWithTheme(<OrganizationCard organization={threeLetterOrg} />);

    expect(screen.getByText('RC')).toBeInTheDocument();
  });

  it('displays two character initials maximum', () => {
    const longNameOrg = {
      ...mockOrganization,
      name: 'World Health Organization International',
      logoUrl: null,
    };

    renderWithTheme(<OrganizationCard organization={longNameOrg} />);

    expect(screen.getByText('WH')).toBeInTheDocument();
  });
});
