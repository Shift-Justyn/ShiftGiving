export type FeatureFlagName = 'RECURRING_DONATIONS' | 'SOCIAL_SHARING' | 'EMAIL_NOTIFICATIONS';

export const DEFAULT_FLAGS: Record<FeatureFlagName, boolean> = {
  RECURRING_DONATIONS: false,
  SOCIAL_SHARING: true,
  EMAIL_NOTIFICATIONS: true,
};

export const FLAG_DESCRIPTIONS: Record<FeatureFlagName, string> = {
  RECURRING_DONATIONS: 'Enable recurring donation option',
  SOCIAL_SHARING: 'Enable social share buttons on confirmation',
  EMAIL_NOTIFICATIONS: 'Enable email notification preferences',
};

export const FEATURE_FLAGS_STORAGE_KEY = 'feature_flags';

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};
