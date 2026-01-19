# ShiftGiving: Expo + React Native + Tamagui Implementation Plan

## Overview

Consolidate React web + Flutter mobile into a single Expo/React Native codebase using Tamagui for universal styling. The existing .NET API remains unchanged.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 52 + React Native |
| Styling | Tamagui (universal components) |
| Navigation | Expo Router (file-based) |
| Server State | TanStack Query |
| Client State | Zustand |
| Forms | React Hook Form + Zod |
| Auth Storage | Expo SecureStore |
| Animations | Moti + Reanimated |
| Maps | react-native-maps |
| Payments | Stripe React Native SDK |
| Testing | Jest + React Native Testing Library + Detox |

---

## Project Structure

```
/native/                              # New Expo app (sibling to /api, /web, /mobile)
├── app/                              # Expo Router file-based routing
│   ├── (auth)/                       # Auth screens (login, register)
│   ├── (tabs)/                       # Tab navigation (home, campaigns, messages, profile)
│   ├── campaign/[id].tsx             # Campaign detail
│   ├── donation/[campaignId].tsx     # Donation flow
│   └── _layout.tsx                   # Root layout
├── src/
│   ├── api/                          # Ported from web (client, auth, campaigns, etc.)
│   ├── components/                   # Tamagui-based components
│   │   ├── ui/                       # Button, Card, Input, Text, Avatar
│   │   ├── campaigns/                # CampaignCard, CampaignProgress
│   │   ├── organizations/            # OrganizationCard
│   │   └── navigation/               # TabBar, Header
│   ├── hooks/                        # useCampaigns, useDonations, useAuth
│   ├── store/                        # Zustand stores (auth, theme, featureFlags)
│   ├── lib/                          # storage, queryClient, validation
│   └── theme/                        # tokens, themes, config
├── __tests__/                        # Mirror src structure
├── tamagui.config.ts
└── package.json
```

---

## Implementation Phases

### Phase 1: Foundation (First)

**Goal:** Validate tech stack with working auth flow

**Tasks:**
1. Create Expo project with TypeScript template
2. Install dependencies (Expo Router, Tamagui, TanStack Query, Zustand)
3. Configure Tamagui with ShiftGiving theme tokens (teal palette from Figma)
4. Set up Expo Router with (auth) and (tabs) groups
5. Port API client from [web/src/api/client.ts](web/src/api/client.ts) - replace localStorage with SecureStore
6. Port TypeScript types from [web/src/api/types.ts](web/src/api/types.ts)
7. Create auth store with Zustand
8. Build login screen with react-hook-form + Zod validation
9. Build register screen with user type toggle (Individual/Organization)
10. Configure Jest + React Native Testing Library
11. Write tests for auth flow

**Validation:** User can register, login, and token persists across app restarts

**Critical Files:**
- `native/tamagui.config.ts` - Design system configuration
- `native/src/api/client.ts` - API client with SecureStore
- `native/src/store/authStore.ts` - Auth state management
- `native/app/_layout.tsx` - Root providers setup
- `native/app/(auth)/login.tsx` - Login screen

---

### Phase 2: Core Browsing

**Goal:** Users can browse campaigns and organizations

**Tasks:**
1. Build tab navigation layout (Home, Campaigns, Messages, Profile)
2. Create CampaignCard component (matches Figma design)
3. Build home screen with horizontal scroll sections
4. Create campaign list screen with vertical scroll
5. Build campaign detail screen with progress bar
6. Create OrganizationCard component
7. Build organization list and detail screens
8. Add pull-to-refresh with TanStack Query
9. Add loading/error states
10. Write component and screen tests

**Validation:** User can browse all campaigns and organizations, view details

**Key Components:**
- `native/src/components/campaigns/CampaignCard.tsx`
- `native/src/components/ui/Progress.tsx`
- `native/app/(tabs)/index.tsx` - Home screen
- `native/app/campaign/[id].tsx` - Campaign detail

---

### Phase 3: Donation Flow

**Goal:** Complete end-to-end donation capability

**Tasks:**
1. Build donation amount selection screen
2. Create payment method selection (card, Apple Pay, Google Pay)
3. Integrate Stripe React Native SDK
4. Build card input form with validation
5. Create donation confirmation screen
6. Display receipt with share option
7. Connect to existing donation API endpoints
8. Write payment flow tests (Stripe test mode)

**Validation:** User can complete a donation in test mode

**Key Screens:**
- `native/app/donation/[campaignId].tsx` - Amount selection
- `native/app/donation/payment.tsx` - Payment method
- `native/app/donation/confirmation.tsx` - Receipt

---

### Phase 4: User Features

**Goal:** History, messages, and profile management

**Tasks:**
1. Build donation history screen with list view
2. Create donation detail view
3. Build messages tab (one-way org → donor)
4. Add message interactions (heart, share)
5. Build profile screen with user info
6. Add theme toggle (light/dark)
7. Implement logout functionality
8. Write feature tests

**Validation:** User can view history, messages, manage profile

---

### Phase 5: Advanced Features

**Goal:** Notifications, search, maps

**Tasks:**
1. Set up Expo Notifications for push
2. Build global search interface
3. Add campaign/org filtering
4. Integrate react-native-maps
5. Display campaign locations on map
6. Add offline support for cached data
7. Write advanced feature tests

**Validation:** Push notifications work, search functional, maps display

---

### Phase 6: Admin Dashboard (Web Only)

**Goal:** Admin interface for organization management

**Tasks:**
1. Adapt Tamagui for desktop breakpoints
2. Create sidebar navigation for admin
3. Build dashboard overview with metrics
4. Create campaign management CRUD
5. Build organization management
6. Add donation tracking table
7. Write admin tests

**Validation:** Admin can manage all entities via web

---

### Phase 7: Polish & Launch

**Goal:** Production-ready application

**Tasks:**
1. Performance optimization (FlashList, image caching)
2. Accessibility audit (screen reader labels, focus)
3. Error boundary and retry logic
4. Port i18n from [web/src/i18n/](web/src/i18n/)
5. Production Stripe configuration
6. App Store / Play Store preparation
7. E2E tests with Detox

**Validation:** All quality gates pass, ready for store submission

---

## API Gaps to Address

The .NET API needs these additions for full MVP support:

| Gap | Priority | Description |
|-----|----------|-------------|
| User Roles | Critical | Add SiteAdmin, MarketingAdmin, Coordinator to UserType enum |
| Notifications | High | New model for push notification tracking |
| Message Interactions | Medium | Add like/share tracking to Message model |
| Campaign Categories | Medium | Add category enum to Campaign |
| Payment Details | Medium | Add TransactionFee, PlatformFee, DonorCoversFees to Donation |
| Payout Tracking | High | New Payout model for 15-30 day holds |

*Note: API work can proceed in parallel with native app development*

---

## Testing Strategy

Following CLAUDE.md TDD guidelines:

1. **Write failing test first**
2. **Run to confirm failure**
3. **Write minimal code to pass**
4. **Run to confirm success**
5. **Refactor if needed**

| Type | Tool | Coverage Target |
|------|------|-----------------|
| Unit | Jest + RNTL | 80% lines |
| E2E (Mobile) | Detox | Critical paths |
| E2E (Web) | Playwright | Critical paths |

---

## Quality Gates (Per Phase)

- All unit tests pass
- All E2E tests pass
- ESLint shows no errors
- TypeScript compiles cleanly
- Manual QA on iOS + Android
- Code review approved

---

## Verification Steps

After each phase, verify:

```bash
# Run unit tests
cd native && npm test

# Run E2E tests (iOS)
npm run e2e:ios

# Run E2E tests (Android)
npm run e2e:android

# Run web
npm run web

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## What to Reuse from Existing Code

### From [web/src/api/](web/src/api/) (Direct Port)
- `client.ts` - HTTP wrapper (swap localStorage → SecureStore)
- `types.ts` - All TypeScript interfaces
- `auth.ts`, `campaigns.ts`, `donations.ts` - API functions

### From [web/src/context/](web/src/context/) (Adapt to Zustand)
- AuthContext patterns → `authStore.ts`
- ThemeContext patterns → `themeStore.ts`
- FeatureFlagsContext patterns → `featureFlagStore.ts`

### From [web/src/i18n/](web/src/i18n/) (Direct Port)
- `locales/en-US.json` - All translations

### From [web/src/themes/](web/src/themes/) (Adapt to Tamagui)
- Color palette → `theme/tokens.ts`
- Theme structure → `theme/themes.ts`

---

## Execution Strategy: Parallel Agents

We will use 2-3 agents simultaneously for efficient token usage:

### Agent 1: Native App Setup (Sonnet)
1. Create `/native` directory in repo root
2. Run `npx create-expo-app@latest native --template tabs`
3. Install dependencies (Tamagui, TanStack Query, Zustand, etc.)
4. Configure Tamagui with theme tokens
5. Set up Expo Router structure
6. Port API client with SecureStore
7. Build auth screens (login, register)
8. Write auth flow tests

### Agent 2: API Schema Updates (Haiku)
1. Add new UserType enum values (SiteAdmin, MarketingAdmin, Coordinator)
2. Create Notification model and endpoints
3. Add MessageInteraction model (likes/shares)
4. Add CampaignCategory enum to Campaign
5. Add payment fee fields to Donation (TransactionFee, PlatformFee, DonorCoversFees)
6. Create Payout model for tracking disbursements
7. Add Organization onboarding fields (billing/marketing contacts)
8. Write tests for new models/endpoints

### Agent 3: Testing & Validation (Haiku) - Optional
1. Set up Jest + React Native Testing Library in native app
2. Configure Detox for E2E testing
3. Create test utilities and helpers
4. Write integration tests for API endpoints
5. Validate native app against local API

---

## Files to Create/Modify

### Native App (New Files)
```
native/
├── tamagui.config.ts           # Theme configuration
├── app/_layout.tsx             # Root layout with providers
├── app/(auth)/login.tsx        # Login screen
├── app/(auth)/register.tsx     # Register screen
├── src/api/client.ts           # HTTP client (port from web)
├── src/api/types.ts            # TypeScript interfaces (port from web)
├── src/store/authStore.ts      # Zustand auth store
├── src/lib/storage.ts          # SecureStore wrapper
├── src/theme/tokens.ts         # Design tokens
└── src/theme/themes.ts         # Light/dark themes
```

### API Updates (Modify Existing)
```
api/ShiftGiving/
├── Models/
│   ├── User.cs                 # Add new UserType values
│   ├── Notification.cs         # NEW: Push notification model
│   ├── MessageInteraction.cs   # NEW: Like/share tracking
│   ├── Payout.cs               # NEW: Payout tracking
│   └── Campaign.cs             # Add Category field
├── DTOs/
│   ├── NotificationDtos.cs     # NEW
│   └── DonationDtos.cs         # Add fee fields
├── Endpoints/
│   └── NotificationEndpoints.cs # NEW
└── Services/
    └── NotificationService.cs  # NEW
```

---

## Success Criteria for Initial Sprint

By end of parallel execution:

**Native App:**
- [ ] Expo project created and configured
- [ ] Tamagui theme matches Figma design
- [ ] Login screen functional against local API
- [ ] Register screen functional
- [ ] Auth token persists across app restarts
- [ ] Unit tests pass for auth flow

**API:**
- [ ] UserType enum has all required values
- [ ] Notification model and basic endpoints exist
- [ ] Payout model created
- [ ] Campaign has Category field
- [ ] Donation has fee tracking fields
- [ ] All new tests pass
