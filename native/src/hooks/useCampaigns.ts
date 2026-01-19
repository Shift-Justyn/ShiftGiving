import { useQuery } from '@tanstack/react-query';
import { getCampaigns } from '../api/campaigns';
import { Campaign, CampaignQueryParams } from '../api/types';

export const useCampaigns = (params?: CampaignQueryParams) => {
  return useQuery<Campaign[], Error>({
    queryKey: ['campaigns', params],
    queryFn: () => getCampaigns(params),
  });
};
