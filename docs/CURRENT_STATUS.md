# Shift Giving - Current Status (January 2026)

## Strategic Direction

**Decision**: Consolidate React web + Flutter mobile into a single Expo/React Native codebase using Tamagui for universal styling.

| Status | Directory | Technology | Notes |
|--------|-----------|------------|-------|
| **Active** | `/native` | Expo + Tamagui | Primary app (iOS, Android, Web) |
| **Active** | `/api` | .NET 10 | Backend API (unchanged) |
| Deprecated | `/mobile` | Flutter | To be archived |
| Legacy | `/web` | React + Vite | Superseded by `/native` |

## Implementation Plan

See [EXPO_IMPLEMENTATION_PLAN.md](EXPO_IMPLEMENTATION_PLAN.md) for detailed phases.

### Phase 1: Foundation (Current)

**Goal**: Validate tech stack with working auth flow

**Tasks**:
1. Create Expo project with TypeScript template
2. Install dependencies (Expo Router, Tamagui, TanStack Query, Zustand)
3. Configure Tamagui with ShiftGiving theme tokens (teal palette)
4. Set up Expo Router with (auth) and (tabs) groups
5. Port API client from web/src/api/client.ts (replace localStorage with SecureStore)
6. Port TypeScript types from web/src/api/types.ts
7. Create auth store with Zustand
8. Build login screen with react-hook-form + Zod validation
9. Build register screen with user type toggle
10. Configure Jest + React Native Testing Library
11. Write tests for auth flow

**Validation**: User can register, login, and token persists across app restarts

## Native App Tech Stack

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
| Payments | Stripe React Native SDK |
| Testing | Jest + React Native Testing Library + Detox |

## What to Reuse from `/web`

| Source | Destination | Adaptation |
|--------|-------------|------------|
| `web/src/api/client.ts` | `native/src/api/client.ts` | Replace localStorage → SecureStore |
| `web/src/api/types.ts` | `native/src/api/types.ts` | Direct port |
| `web/src/api/*.ts` | `native/src/api/*.ts` | Direct port |
| `web/src/i18n/locales/` | `native/src/i18n/` | Direct port |
| `web/src/themes/` | `native/src/theme/` | Adapt to Tamagui tokens |

## API Gaps to Address

| Gap | Priority | Description |
|-----|----------|-------------|
| User Roles | Critical | Add SiteAdmin, MarketingAdmin, Coordinator to UserType enum |
| Notifications | High | New model for push notification tracking |
| Message Interactions | Medium | Add like/share tracking to Message model |
| Campaign Categories | Medium | Add category enum to Campaign |
| Payment Details | Medium | Add TransactionFee, PlatformFee, DonorCoversFees to Donation |
| Payout Tracking | High | New Payout model for 15-30 day holds |

## Agent Strategy for Implementation

### Parallel Execution (when context < 50%)

**Agent 1 (Sonnet)**: Native App Setup
- Create `/native` Expo project
- Install and configure Tamagui
- Set up Expo Router
- Port API client with SecureStore
- Build auth screens

**Agent 2 (Haiku)**: API Schema Updates
- Add new UserType enum values
- Create Notification model and endpoints
- Add Campaign Category field
- Add payment fee fields to Donation
- Create Payout model

### Commands After Compact

```bash
# Verify native app structure
ls -la native/

# Run native app tests
cd native && npm test

# Run API tests
cd api/ShiftGiving.Tests && dotnet test
```
