import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import * as Router from 'expo-router';
import CampaignDetailScreen from '../[id]';
import * as hooks from '@/src/hooks/useOneCampaign';

jest.mock('expo-router');
jest.mock('@/src/hooks/useOneCampaign');

const mockCampaign = {
  id: '1',
  title: 'Clean Water Initiative',
  name: 'Clean Water Initiative',
  description: 'A detailed description about providing clean water to communities in need.',
  shortDescription: 'Providing clean water',
  goalAmount: 10000,
  raisedAmount: 5000,
  status: 'active',
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2027-12-31T00:00:00Z',
  featuredImageUrl: 'https://example.com/image.jpg',
  videoUrl: null,
  organization: {
    id: 'org1',
    name: 'Water Org',
    logoUrl: null,
    description: 'Organization description',
  },
};

describe('CampaignDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hooks.useOneCampaign as jest.Mock).mockReturnValue({
      data: mockCampaign,
      isLoading: false,
    });

    (Router.useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    (Router.useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      back: jest.fn(),
    });
  });

  it('renders campaign title', async () => {
    const { getByText } = render(<CampaignDetailScreen />);
    await waitFor(() => expect(getByText('Clean Water Initiative')).toBeTruthy());
  });

  it('renders campaign description', async () => {
    const { getByText } = render(<CampaignDetailScreen />);
    await waitFor(() => expect(getByText(/providing clean water to communities/i)).toBeTruthy());
  });

  it('renders donate button', async () => {
    const { getByTestId } = render(<CampaignDetailScreen />);
    await waitFor(() => expect(getByTestId('donate-button')).toBeTruthy());
  });

  it('navigates to donate when button pressed', async () => {
    const mockPush = jest.fn();
    (Router.useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: jest.fn(),
    });

    const { getByTestId } = render(<CampaignDetailScreen />);
    const donateButton = getByTestId('donate-button');
    fireEvent.press(donateButton);

    expect(mockPush).toHaveBeenCalledWith('/donation/1');
  });

  it('navigates back when back button pressed', async () => {
    const mockBack = jest.fn();
    (Router.useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      back: mockBack,
    });

    const { getByTestId } = render(<CampaignDetailScreen />);
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockBack).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    (hooks.useOneCampaign as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { UNSAFE_getByType } = render(<CampaignDetailScreen />);
    expect(UNSAFE_getByType(require('react-native').ActivityIndicator)).toBeTruthy();
  });

  it('shows error state when campaign not found', () => {
    (hooks.useOneCampaign as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    const { getByText } = render(<CampaignDetailScreen />);
    expect(getByText('Campaign not found')).toBeTruthy();
  });

  it('renders social share buttons', async () => {
    const { getByTestId } = render(<CampaignDetailScreen />);
    await waitFor(() => {
      expect(getByTestId('share-logo-facebook')).toBeTruthy();
    });
  });
});
