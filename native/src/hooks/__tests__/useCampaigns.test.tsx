import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCampaigns } from '../useCampaigns';
import * as campaignsApi from '../../api/campaigns';
import { Campaign } from '../../api/types';

jest.mock('../../api/campaigns');

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Campaign One',
    shortDescription: 'First campaign',
    goalAmount: 10000,
    raisedAmount: 5000,
    status: 'active',
    featuredImageUrl: null,
    organization: { id: 'org1', name: 'Org One', logoUrl: null },
    endDate: '2026-12-31T00:00:00Z',
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCampaigns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns campaigns on success', async () => {
    (campaignsApi.getCampaigns as jest.Mock).mockResolvedValue(mockCampaigns);
    const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCampaigns);
  });

  test('returns error on failure', async () => {
    (campaignsApi.getCampaigns as jest.Mock).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Network error');
  });

  test('passes query params to API', async () => {
    (campaignsApi.getCampaigns as jest.Mock).mockResolvedValue(mockCampaigns);
    const { result } = renderHook(() => useCampaigns({ featured: true }), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(campaignsApi.getCampaigns).toHaveBeenCalledWith({ featured: true });
  });
});
