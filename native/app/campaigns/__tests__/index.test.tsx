import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import * as Router from 'expo-router';
import CampaignsScreen from '../index';
import * as hooks from '@/src/hooks/useCampaigns';

jest.mock('expo-router');
jest.mock('@/src/hooks/useCampaigns');

const mockCampaigns = [
  {
    id: '1',
    title: 'Clean Water Initiative',
    shortDescription: 'Providing clean water',
    goalAmount: 10000,
    raisedAmount: 5000,
    status: 'active',
    featuredImageUrl: 'https://example.com/image1.jpg',
    organization: { id: 'org1', name: 'Water Org', logoUrl: null },
    endDate: '2027-12-31T00:00:00Z',
  },
  {
    id: '2',
    title: 'Education for All',
    shortDescription: 'Supporting education',
    goalAmount: 20000,
    raisedAmount: 15000,
    status: 'active',
    featuredImageUrl: 'https://example.com/image2.jpg',
    organization: { id: 'org2', name: 'Education Org', logoUrl: null },
    endDate: '2027-06-30T00:00:00Z',
  },
];

describe('CampaignsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hooks.useCampaigns as jest.Mock).mockReturnValue({
      data: mockCampaigns,
      isLoading: false,
      refetch: jest.fn(),
    });

    (Router.useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      back: jest.fn(),
    });
  });

  it('renders all campaigns', async () => {
    const { getByText } = render(<CampaignsScreen />);

    await waitFor(() => {
      expect(getByText('Clean Water Initiative')).toBeTruthy();
    });
  });

  it('filters campaigns by search query', async () => {
    const { getByText, getByTestId, queryByText } = render(<CampaignsScreen />);

    const searchInput = getByTestId('search-input');
    fireEvent.changeText(searchInput, 'Education');

    await waitFor(() => {
      expect(getByText('Education for All')).toBeTruthy();
      expect(queryByText('Clean Water Initiative')).toBeFalsy();
    });
  });

  it('navigates back when back button pressed', async () => {
    const mockBack = jest.fn();
    (Router.useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      back: mockBack,
    });

    const { getByTestId } = render(<CampaignsScreen />);

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockBack).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    (hooks.useCampaigns as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      refetch: jest.fn(),
    });

    const { UNSAFE_getByType } = render(<CampaignsScreen />);
    expect(UNSAFE_getByType(require('react-native').ActivityIndicator)).toBeTruthy();
  });
});
