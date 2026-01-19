import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CampaignCard } from '../CampaignCard';
import { Campaign } from '../../../api/types';

const mockCampaign: Campaign = {
  id: '1',
  title: 'Save the Rainforest',
  shortDescription: 'Help us protect endangered species and preserve vital ecosystems.',
  goalAmount: 10000,
  raisedAmount: 5000,
  status: 'active',
  featuredImageUrl: 'https://example.com/image.jpg',
  organization: { id: 'org1', name: 'Green Earth', logoUrl: null },
  endDate: '2026-03-01T00:00:00Z',
};

describe('CampaignCard', () => {
  test('renders campaign title', () => {
    const { getByText } = render(<CampaignCard campaign={mockCampaign} onPress={jest.fn()} />);
    expect(getByText('Save the Rainforest')).toBeTruthy();
  });

  test('renders goal amount badge', () => {
    const { getByText } = render(<CampaignCard campaign={mockCampaign} onPress={jest.fn()} />);
    expect(getByText('$10,000')).toBeTruthy();
  });

  test('renders short description', () => {
    const { getByText } = render(<CampaignCard campaign={mockCampaign} onPress={jest.fn()} />);
    expect(getByText('Help us protect endangered species and preserve vital ecosystems.')).toBeTruthy();
  });

  test('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<CampaignCard campaign={mockCampaign} onPress={onPress} />);
    const card = getByTestId('campaign-card');
    fireEvent.press(card);
    expect(onPress).toHaveBeenCalled();
  });

  test('shows closing soon badge when campaign ends soon', () => {
    const closingSoon = { ...mockCampaign, endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() };
    const { getByText } = render(<CampaignCard campaign={closingSoon} onPress={jest.fn()} />);
    expect(getByText('Closing Soon!')).toBeTruthy();
  });

  test('renders with animation when index prop is provided', () => {
    const { getByTestId } = render(<CampaignCard campaign={mockCampaign} onPress={jest.fn()} index={1} />);
    expect(getByTestId('campaign-card')).toBeTruthy();
  });

  test('renders with stagger animation delay', () => {
    const { getByTestId } = render(<CampaignCard campaign={mockCampaign} onPress={jest.fn()} index={2} />);
    expect(getByTestId('campaign-card')).toBeTruthy();
  });
});
