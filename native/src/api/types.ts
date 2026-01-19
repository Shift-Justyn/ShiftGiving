export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  avatarUrl: string | null;
}

export interface AuthLoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface AuthRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CampaignQueryParams {
  page?: number;
  pageSize?: number;
  status?: string;
  featured?: boolean;
}

export interface CampaignOrganization {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface Campaign {
  id: string;
  title: string;
  shortDescription: string | null;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  featuredImageUrl: string | null;
  organization: CampaignOrganization;
  endDate: string;
}

export interface CampaignOrganizationDetail {
  id: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
}

export interface CampaignDetail {
  id: string;
  title: string;
  name: string;
  description: string | null;
  shortDescription: string | null;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  startDate: string;
  endDate: string;
  featuredImageUrl: string | null;
  videoUrl: string | null;
  organization: CampaignOrganizationDetail;
}

export interface Organization {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  campaignCount: number;
}

export interface ActiveCampaignInfo {
  id: string;
  title: string;
}

export interface OrganizationDetail {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  contactEmail: string | null;
  activeCampaigns: ActiveCampaignInfo[];
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface CreateDonationRequest {
  amount: number;
  campaignId: string;
  organizationId: string;
  isAnonymous: boolean;
  donorMessage?: string;
  paymentMethod: string;
}

export interface Donation {
  id: string;
  userId: string;
  campaignId: string;
  organizationId: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  paymentIntentId?: string;
  isAnonymous: boolean;
  donorMessage?: string;
  receiptSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationListItem {
  id: string;
  amount: number;
  status: string;
  campaignTitle: string;
  organizationName: string;
  createdAt: string;
}

export interface DonationSummary {
  totalDonations: number;
  totalAmount: number;
  averageDonation: number;
}

export enum CampaignCategory {
  Health = 'Health',
  Education = 'Education',
  Environment = 'Environment',
  Community = 'Community',
  Arts = 'Arts',
  Emergency = 'Emergency',
}

export enum PaymentMethod {
  Card = 'card',
  ApplePay = 'apple_pay',
  GooglePay = 'google_pay',
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Payout {
  id: string;
  organizationId: string;
  amount: number;
  status: string;
  processedAt: string | null;
  createdAt: string;
}
