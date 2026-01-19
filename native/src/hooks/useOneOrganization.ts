import { useQuery } from '@tanstack/react-query';
import { getOrganizationById } from '../api/campaigns';
import { OrganizationDetail } from '../api/types';

export const useOneOrganization = (id: string) => {
  return useQuery<OrganizationDetail, Error>({
    queryKey: ['organization', id],
    queryFn: () => getOrganizationById(id),
    enabled: !!id,
  });
};
