import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  FeatureFlagName,
  DEFAULT_FLAGS,
  FEATURE_FLAGS_STORAGE_KEY,
  isProduction,
} from '../config/featureFlags';

type FeatureFlags = Record<FeatureFlagName, boolean>;

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  isEnabled: (flagName: FeatureFlagName) => boolean;
  toggleFlag: (flagName: FeatureFlagName) => void;
  resetFlags: () => void;
  canToggle: boolean;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

const getStoredFlags = (): Partial<FeatureFlags> | null => {
  const stored = localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);
  if (!stored) return null;
  return JSON.parse(stored) as Partial<FeatureFlags>;
};

const storeFlags = (flags: FeatureFlags): void => {
  localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, JSON.stringify(flags));
};

const clearStoredFlags = (): void => {
  localStorage.removeItem(FEATURE_FLAGS_STORAGE_KEY);
};

export const FeatureFlagsProvider = ({ children }: { children: ReactNode }) => {
  const [flags, setFlags] = useState<FeatureFlags>({ ...DEFAULT_FLAGS });
  const canToggle = !isProduction();

  useEffect(() => {
    if (canToggle) {
      const storedFlags = getStoredFlags();
      if (storedFlags) {
        setFlags({ ...DEFAULT_FLAGS, ...storedFlags });
      }
    }
  }, [canToggle]);

  const isEnabled = (flagName: FeatureFlagName): boolean => {
    return flags[flagName] ?? DEFAULT_FLAGS[flagName] ?? false;
  };

  const toggleFlag = (flagName: FeatureFlagName): void => {
    if (!canToggle) return;

    setFlags((prev) => {
      const updated = { ...prev, [flagName]: !prev[flagName] };
      storeFlags(updated);
      return updated;
    });
  };

  const resetFlags = (): void => {
    if (!canToggle) return;

    clearStoredFlags();
    setFlags({ ...DEFAULT_FLAGS });
  };

  return (
    <FeatureFlagsContext.Provider
      value={{
        flags,
        isEnabled,
        toggleFlag,
        resetFlags,
        canToggle,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = (): FeatureFlagsContextType => {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};
