import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOneCampaign } from '../useOneCampaign';
import * as campaignsApi from '../../api/campaigns';
import { CampaignDetail } from '../../api/types';

jest.mock('../../api/campaigns');

const mockCampaignDetail: CampaignDetail = {
  id: '1',
  title: 'Test Campaign',
  name: 'Test Campaign',
  description: 'Full campaign description',
  shortDescription: 'Short description',
  goalAmount: 10000,
  raisedAmount: 5000,
  status: 'active',
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-12-31T00:00:00Z',
  featuredImageUrl: 'https://example.com/image.jpg',
  videoUrl: null,
  organization: {
    id: 'org1',
    name: 'Test Organization',
    logoUrl: null,
    description: 'Org description',
  },
};

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useOneCampaign', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns campaign detail on success', async () => {
    (campaignsApi.getCampaignById as jest.Mock).mockResolvedValue(mockCampaignDetail);
    const { result } = renderHook(() => useOneCampaign('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCampaignDetail);
  });

  test('returns error on failure', async () => {
    (campaignsApi.getCampaignById as jest.Mock).mockRejectedValue(new Error('Not found'));
    const { result } = renderHook(() => useOneCampaign('999'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Not found');
  });

  test('passes campaign id to API', async () => {
    (campaignsApi.getCampaignById as jest.Mock).mockResolvedValue(mockCampaignDetail);
    const { result } = renderHook(() => useOneCampaign('abc123'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(campaignsApi.getCampaignById).toHaveBeenCalledWith('abc123');
  });
});
