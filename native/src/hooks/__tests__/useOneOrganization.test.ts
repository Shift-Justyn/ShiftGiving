import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useOneOrganization } from '../useOneOrganization';
import * as campaignsApi from '../../api/campaigns';

jest.mock('../../api/campaigns');

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(QueryClientProvider, { client: createQueryClient() }, children);

describe('useOneOrganization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches organization by id', async () => {
    const mockOrganization = {
      id: '1',
      name: 'Test Org',
      description: 'A test organization',
      logoUrl: 'http://example.com/logo.png',
      websiteUrl: 'http://example.com',
      contactEmail: 'contact@example.com',
      activeCampaigns: [],
    };

    (campaignsApi.getOrganizationById as jest.Mock).mockResolvedValue(mockOrganization);

    const { result } = renderHook(() => useOneOrganization('1'), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockOrganization);
    });
  });

  it('does not fetch when id is empty', () => {
    renderHook(() => useOneOrganization(''), { wrapper });

    expect(campaignsApi.getOrganizationById).not.toHaveBeenCalled();
  });
});
