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

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size?: string;
  createdAt: string;
}

export interface MediaGalleryItem {
  type: string;
  url: string;
  caption?: string;
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
  category?: string;
  location?: string;
  mediaGallery?: MediaGalleryItem[];
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
  mediaGallery?: MediaGalleryItem[];
}

export interface Organization {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  campaignCount: number;
  latitude?: number;
  longitude?: number;
  category?: string;
}

export interface AuthRefreshRequest {
  refreshToken: string;
}

export interface AuthRefreshResponse {
  token: string;
  refreshToken: string;
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
