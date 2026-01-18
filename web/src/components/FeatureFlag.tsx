import { ReactNode } from 'react';
import { useFeatureFlags } from '../context/FeatureFlagsContext';
import { FeatureFlagName } from '../config/featureFlags';

interface FeatureFlagProps {
  name: FeatureFlagName;
  children: ReactNode;
  fallback?: ReactNode;
}

export const FeatureFlag = ({ name, children, fallback = null }: FeatureFlagProps) => {
  const { isEnabled } = useFeatureFlags();

  if (isEnabled(name)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
