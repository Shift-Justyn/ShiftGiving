import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import ConfirmationScreen from '../confirmation';
import * as donationsApi from '@/src/api/donations';

jest.mock('@/src/api/donations');
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useLocalSearchParams: () => ({ donationId: '1' }),
}));

describe('ConfirmationScreen', () => {
  it('loads and displays donation', async () => {
    const mockDonation = {
      id: '1',
      amount: 100,
      createdAt: new Date().toISOString(),
    };
    (donationsApi.getDonationById as jest.Mock).mockResolvedValue(mockDonation);

    const { getByText } = render(<ConfirmationScreen />);

    await waitFor(() => {
      expect(getByText('Thank You!')).toBeTruthy();
    });
  });
});
