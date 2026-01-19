import { get, getWithAuth, post } from './client';
import { CreateDonationRequest, Donation, DonationListItem, DonationSummary } from './types';

export const createDonation = (
  request: CreateDonationRequest,
  token: string
): Promise<Donation> => {
  return post<Donation>('/api/donations', request, token);
};

export const getDonationById = (id: string): Promise<Donation> => {
  return get<Donation>(`/api/donations/${id}`);
};

export const getUserDonations = (
  userId: string,
  token: string,
  page = 1,
  pageSize = 20
): Promise<DonationListItem[]> => {
  return getWithAuth<DonationListItem[]>(`/api/donations/user/${userId}`, token, {
    page,
    pageSize,
  });
};

export const getCampaignDonations = (
  campaignId: string,
  page = 1,
  pageSize = 20
): Promise<DonationListItem[]> => {
  return get<DonationListItem[]>(`/api/donations/campaign/${campaignId}`, {
    page,
    pageSize,
  });
};

export const getCampaignDonationSummary = (campaignId: string): Promise<DonationSummary> => {
  return get<DonationSummary>(`/api/donations/campaign/${campaignId}/summary`);
};
