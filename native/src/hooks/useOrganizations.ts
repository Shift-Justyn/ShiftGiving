import { useQuery } from '@tanstack/react-query';
import { getOrganizations } from '../api/campaigns';
import { Organization } from '../api/types';

export const useOrganizations = () => {
  return useQuery<Organization[], Error>({
    queryKey: ['organizations'],
    queryFn: getOrganizations,
  });
};
