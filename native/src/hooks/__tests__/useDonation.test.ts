import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useDonation } from '../useDonation';
import * as donationsApi from '../../api/donations';

jest.mock('../../api/donations');

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(QueryClientProvider, { client: createQueryClient() }, children);

describe('useDonation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls createDonation with correct params', async () => {
    const mockDonation = { id: '1', amount: 100 };
    (donationsApi.createDonation as jest.Mock).mockResolvedValue(mockDonation);

    const { result } = renderHook(() => useDonation(), { wrapper });

    result.current.mutate({
      request: {
        amount: 100,
        campaignId: 'c1',
        organizationId: 'o1',
        isAnonymous: false,
        paymentMethod: 'card',
      },
      token: 'test-token',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
