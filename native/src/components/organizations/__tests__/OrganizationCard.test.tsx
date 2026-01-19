import { render, fireEvent } from '@testing-library/react-native';
import { OrganizationCard } from '../OrganizationCard';
import { Organization } from '../../../api/types';

const mockOrganization: Organization = {
  id: 'org1',
  name: 'Green Earth Foundation',
  description: 'Protecting the environment for future generations.',
  logoUrl: 'https://example.com/logo.jpg',
  campaignCount: 5,
};

describe('OrganizationCard', () => {
  test('renders organization name', () => {
    const { getByText } = render(<OrganizationCard organization={mockOrganization} onPress={jest.fn()} />);
    expect(getByText('Green Earth Foundation')).toBeTruthy();
  });

  test('renders campaign count', () => {
    const { getByText } = render(<OrganizationCard organization={mockOrganization} onPress={jest.fn()} />);
    expect(getByText('5 campaigns')).toBeTruthy();
  });

  test('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<OrganizationCard organization={mockOrganization} onPress={onPress} />);
    fireEvent.press(getByTestId('organization-card'));
    expect(onPress).toHaveBeenCalledWith(mockOrganization);
  });

  test('handles singular campaign count', () => {
    const singleCampaign = { ...mockOrganization, campaignCount: 1 };
    const { getByText } = render(<OrganizationCard organization={singleCampaign} onPress={jest.fn()} />);
    expect(getByText('1 campaign')).toBeTruthy();
  });
});
