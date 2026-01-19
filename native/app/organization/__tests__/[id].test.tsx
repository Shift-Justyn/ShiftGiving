import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import * as Router from 'expo-router';
import OrganizationDetailScreen from '../[id]';
import * as hooks from '@/src/hooks/useOneOrganization';

jest.mock('expo-router');
jest.mock('@/src/hooks/useOneOrganization');

const mockOrganization = {
  id: '1',
  name: 'Green Earth Foundation',
  description: 'Protecting the environment for future generations.',
  logoUrl: 'https://example.com/logo.jpg',
  websiteUrl: 'https://example.com',
  contactEmail: 'contact@example.com',
  activeCampaigns: [
    { id: 'campaign1', title: 'Climate Action Initiative' },
    { id: 'campaign2', title: 'Ocean Cleanup Project' },
  ],
};

describe('OrganizationDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hooks.useOneOrganization as jest.Mock).mockReturnValue({
      data: mockOrganization,
      isLoading: false,
    });

    (Router.useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      back: jest.fn(),
    });

    (Router.useLocalSearchParams as jest.Mock).mockReturnValue({
      id: '1',
    });
  });

  it('renders organization name', async () => {
    const { getByText } = render(<OrganizationDetailScreen />);

    await waitFor(() => {
      expect(getByText('Green Earth Foundation')).toBeTruthy();
    });
  });

  it('renders mission statement', async () => {
    const { getByText } = render(<OrganizationDetailScreen />);

    await waitFor(() => {
      expect(
        getByText('Protecting the environment for future generations.')
      ).toBeTruthy();
    });
  });

  it('renders active campaigns', async () => {
    const { getByText } = render(<OrganizationDetailScreen />);

    await waitFor(() => {
      expect(getByText('Climate Action Initiative')).toBeTruthy();
      expect(getByText('Ocean Cleanup Project')).toBeTruthy();
    });
  });

  it('switches tabs when tab toggle is pressed', async () => {
    const { getByText, queryByText } = render(<OrganizationDetailScreen />);

    await waitFor(() => {
      expect(getByText('Overview')).toBeTruthy();
    });

    fireEvent.press(getByText('Posts'));

    await waitFor(() => {
      expect(queryByText('Mission')).toBeFalsy();
      expect(getByText('Updates from this organization will appear here')).toBeTruthy();
    });
  });

  it('shows loading state', () => {
    (hooks.useOneOrganization as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { UNSAFE_getByType } = render(<OrganizationDetailScreen />);
    expect(UNSAFE_getByType(require('react-native').ActivityIndicator)).toBeTruthy();
  });

  it('shows error when organization not found', async () => {
    (hooks.useOneOrganization as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    const { getByText } = render(<OrganizationDetailScreen />);

    await waitFor(() => {
      expect(getByText('Organization not found')).toBeTruthy();
    });
  });

  it('navigates back when back button pressed', async () => {
    const mockBack = jest.fn();
    (Router.useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      back: mockBack,
    });

    const { getByTestId } = render(<OrganizationDetailScreen />);

    await waitFor(() => {
      const backButton = getByTestId('back-button');
      fireEvent.press(backButton);
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it('navigates to donate screen when donate button pressed', async () => {
    const mockPush = jest.fn();
    (Router.useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: jest.fn(),
    });

    const { getByTestId } = render(<OrganizationDetailScreen />);

    await waitFor(() => {
      expect(getByTestId('donate-button')).toBeTruthy();
    });

    fireEvent.press(getByTestId('donate-button'));
    expect(mockPush).toHaveBeenCalledWith('/donate');
  });
});
