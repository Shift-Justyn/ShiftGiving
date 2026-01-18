import { get } from './client';
import { Campaign, CampaignQueryParams, Organization } from './types';

export const getCampaigns = (params?: CampaignQueryParams): Promise<Campaign[]> => {
  return get<Campaign[]>('/api/campaigns', params as Record<string, string | number | boolean>);
};

export const getCampaignById = (id: string): Promise<Campaign> => {
  return get<Campaign>(`/api/campaigns/${id}`);
};

export const getOrganizations = (): Promise<Organization[]> => {
  return get<Organization[]>('/api/organizations');
};

export const getOrganizationById = (id: string): Promise<Organization> => {
  return get<Organization>(`/api/organizations/${id}`);
};
