# Feature Flags System Implementation Plan

## Overview
Implement a feature flags system that allows toggling features on/off for non-production environments, following existing context patterns in the codebase.

## Architecture

### Design Decisions
1. **Context-based** - Follow AuthContext/ThemeContext patterns
2. **Type-safe** - TypeScript enum for flag names
3. **Environment-aware** - Only allow runtime toggles in non-production
4. **localStorage persistence** - Save user overrides for dev/QA testing
5. **Centralized defaults** - Single source of truth for flag definitions

### Feature Flags (from .env.example)
- `RECURRING_DONATIONS` - Enable recurring donation option
- `SOCIAL_SHARING` - Enable social share buttons on confirmation
- `EMAIL_NOTIFICATIONS` - Enable email notification preferences

## Files to Create/Modify

### 1. `web/src/config/featureFlags.ts` (NEW)
Define flag names, defaults, and types:
```typescript
export type FeatureFlagName =
  | 'RECURRING_DONATIONS'
  | 'SOCIAL_SHARING'
  | 'EMAIL_NOTIFICATIONS';

export const DEFAULT_FLAGS: Record<FeatureFlagName, boolean> = {
  RECURRING_DONATIONS: false,
  SOCIAL_SHARING: true,
  EMAIL_NOTIFICATIONS: true,
};
```

### 2. `web/src/context/FeatureFlagsContext.tsx` (NEW)
React context provider following AuthContext pattern:
- `FeatureFlagsProvider` - Wraps app, manages flag state
- `useFeatureFlags()` - Hook to access flags
- `isEnabled(flagName)` - Check if flag is enabled
- `toggleFlag(flagName)` - Toggle flag (non-prod only)
- `resetFlags()` - Reset to defaults

### 3. `web/src/components/FeatureFlag.tsx` (NEW)
Declarative component for conditional rendering:
```tsx
<FeatureFlag name="SOCIAL_SHARING">
  <SocialShareButtons />
</FeatureFlag>
```

### 4. `web/src/components/FeatureFlagDevTools.tsx` (NEW)
Dev-only panel to toggle flags (only renders in non-production):
- Shows all flags with toggle switches
- Reset all button
- Only visible when `NODE_ENV !== 'production'`

### 5. `web/src/index.tsx` (MODIFY)
Wrap app with `FeatureFlagsProvider`

### 6. `web/webpack.config.js` (MODIFY)
Add DefinePlugin for `process.env.NODE_ENV`

### 7. `web/src/pages/DonationConfirmationPage.tsx` (MODIFY)
Wrap social share buttons with FeatureFlag component

## Implementation Order

1. ✅ Create `featureFlags.ts` config with types and defaults
2. ✅ Create `FeatureFlagsContext.tsx` with provider and hook
3. ✅ Create `FeatureFlag.tsx` wrapper component
4. ✅ Update `index.tsx` to add provider
5. ✅ Update webpack config for environment detection
6. ✅ Create `FeatureFlagDevTools.tsx` component
7. ✅ Apply feature flag to social sharing in confirmation page
8. ✅ Write tests for context and components

## Status: COMPLETE

All 73 tests pass. Feature flags system is fully implemented and tested.

## Testing Strategy

### Unit Tests
- `FeatureFlagsContext.test.tsx` - Test provider, hook, toggle logic
- `FeatureFlag.test.tsx` - Test conditional rendering

### Test Cases
1. Flags load from defaults correctly
2. Flags persist to localStorage in non-prod
3. Toggle updates flag state
4. FeatureFlag component renders/hides children
5. Production mode prevents toggle
6. Reset restores defaults

## Verification

1. Run `npm test` - All tests pass
2. Run `npm start` - App loads without errors
3. In browser console: `localStorage.getItem('feature_flags')` shows saved state
4. FeatureFlagDevTools visible in development
5. Toggle a flag and verify component hides/shows
6. Refresh page - flag state persists
