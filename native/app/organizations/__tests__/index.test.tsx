import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import * as Router from 'expo-router';
import OrganizationsScreen from '../index';
import * as hooks from '@/src/hooks/useOrganizations';

jest.mock('expo-router');
jest.mock('@/src/hooks/useOrganizations');

const mockOrganizations = [
  {
    id: '1',
    name: 'Green Earth Foundation',
    description: 'Environmental charity',
    logoUrl: 'https://example.com/logo1.jpg',
    campaignCount: 3,
  },
  {
    id: '2',
    name: 'Tech for Good',
    description: 'Technology charity',
    logoUrl: 'https://example.com/logo2.jpg',
    campaignCount: 2,
  },
];

describe('OrganizationsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hooks.useOrganizations as jest.Mock).mockReturnValue({
      data: mockOrganizations,
      isLoading: false,
      refetch: jest.fn(),
    });

    (Router.useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      back: jest.fn(),
    });
  });

  it('renders all organizations', async () => {
    const { getByText } = render(<OrganizationsScreen />);

    await waitFor(() => {
      expect(getByText('Green Earth Foundation')).toBeTruthy();
      expect(getByText('Tech for Good')).toBeTruthy();
    });
  });

  it('filters organizations by search query', async () => {
    const { getByText, getByTestId, queryByText } = render(<OrganizationsScreen />);

    const searchInput = getByTestId('search-input');
    fireEvent.changeText(searchInput, 'Tech');

    await waitFor(() => {
      expect(getByText('Tech for Good')).toBeTruthy();
      expect(queryByText('Green Earth Foundation')).toBeFalsy();
    });
  });

  it('navigates back when back button pressed', async () => {
    const mockBack = jest.fn();
    (Router.useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      back: mockBack,
    });

    const { getByTestId } = render(<OrganizationsScreen />);

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockBack).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    (hooks.useOrganizations as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      refetch: jest.fn(),
    });

    const { UNSAFE_getByType } = render(<OrganizationsScreen />);
    expect(UNSAFE_getByType(require('react-native').ActivityIndicator)).toBeTruthy();
  });
});
