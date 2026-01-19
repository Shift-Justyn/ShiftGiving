import { useQuery } from '@tanstack/react-query';
import { getCampaignById } from '../api/campaigns';
import { CampaignDetail } from '../api/types';

export const useOneCampaign = (id: string) => {
  return useQuery<CampaignDetail, Error>({
    queryKey: ['campaign', id],
    queryFn: () => getCampaignById(id),
    enabled: !!id,
  });
};
