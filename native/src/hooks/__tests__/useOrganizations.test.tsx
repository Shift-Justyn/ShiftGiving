import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOrganizations } from '../useOrganizations';
import * as campaignsApi from '../../api/campaigns';
import { Organization } from '../../api/types';

jest.mock('../../api/campaigns');

const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'Org One',
    description: 'First organization',
    logoUrl: null,
    campaignCount: 3,
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useOrganizations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns organizations on success', async () => {
    (campaignsApi.getOrganizations as jest.Mock).mockResolvedValue(mockOrganizations);
    const { result } = renderHook(() => useOrganizations(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockOrganizations);
  });

  test('returns error on failure', async () => {
    (campaignsApi.getOrganizations as jest.Mock).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useOrganizations(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Network error');
  });
});
