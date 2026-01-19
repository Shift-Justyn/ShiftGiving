# ShiftGiving Unified App Plan

## Overview

This document outlines the plan to rebuild ShiftGiving as a unified cross-platform application using React Native + Expo + Tamagui, targeting iOS, Android, and Web from a single codebase.

**Decision Date:** January 2025
**Status:** Planning Phase

---

## Strategic Decisions

### Platform Consolidation

| Before | After |
|--------|-------|
| React web app (styled-components) | React Native + Expo (unified) |
| Flutter mobile app | Deprecated |
| Two codebases, two design systems | One codebase, one design system |

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React Native + Expo | Team expertise in React/JS, Expo simplifies builds |
| **Web Support** | Expo Web (React Native Web) | Single codebase → all platforms |
| **Styling/UI** | Tamagui | Universal components, compile-time optimization, built-in theming |
| **Navigation** | Expo Router | File-based routing, works on all platforms |
| **State (Server)** | TanStack Query | API caching, refetching, used in CarbonOffset reference |
| **State (Client)** | Zustand or Context | Simple global state (auth, preferences) |
| **Animations** | Tamagui animations + Moti | Built-in support, gesture handling |
| **Maps** | react-native-maps + Google Maps | Platform-appropriate rendering |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **Backend** | .NET 10 + PostgreSQL | Existing API (unchanged) |
| **Auth** | JWT + Expo SecureStore | Secure token storage |

---

## Design Philosophy

### Approach: Figma-First with CarbonOffset Enhancements

We will follow the Figma designs as the primary source of truth, enhancing them with select features from the CarbonOffset reference project.

**From Figma:**
- Overall layout and navigation patterns
- Color scheme and branding (teal/cyan palette)
- Mobile-first philosophy with bottom tabs
- Clean, minimal aesthetic with generous whitespace
- Auth flow (Individual/Charity toggle)
- History view (simple list cards)
- Admin/SaaS dashboard structure

**From CarbonOffset:**
- Interactive map with location markers
- Rich hover effects and animations
- Progress bars on campaign cards
- Filter system by category
- Donation flow UX patterns
- Smooth page transitions

---

## Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#00a0c4` | Primary actions, links, active states |
| `primaryHover` | `#008ba8` | Hover states |
| `primaryLight` | `#e0f4f8` | Backgrounds, badges |
| `primaryGradientStart` | `#006d87` | Gradient backgrounds |
| `primaryGradientEnd` | `#00b4d8` | Gradient backgrounds |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#ffffff` | Main background |
| `backgroundPage` | `#f5f5f5` | Page backgrounds |
| `backgroundCard` | `#ffffff` | Card backgrounds |
| `textPrimary` | `#1a1a1a` | Primary text |
| `textSecondary` | `#6b7280` | Secondary text |
| `textTertiary` | `#9ca3af` | Placeholder text |
| `textInverse` | `#ffffff` | Text on dark backgrounds |
| `border` | `#e5e7eb` | Borders, dividers |
| `borderLight` | `#f3f4f6` | Subtle borders |

### Status Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#22c55e` | Success states, positive trends |
| `error` | `#ef4444` | Errors, destructive actions |
| `warning` | `#f59e0b` | Warnings, attention needed |
| `info` | `#3b82f6` | Informational |

### Category Colors (for campaigns/causes)

| Token | Hex | Category |
|-------|-----|----------|
| `categoryEducation` | `#3b82f6` | Education |
| `categoryHealth` | `#ef4444` | Health & Medical |
| `categoryEnvironment` | `#22c55e` | Environment |
| `categoryHumanitarian` | `#f59e0b` | Humanitarian Aid |
| `categoryCommunity` | `#8b5cf6` | Community Development |
| `categoryAnimals` | `#ec4899` | Animal Welfare |
| `categoryArts` | `#06b6d4` | Arts & Culture |
| `categoryReligious` | `#6366f1` | Religious |

---

## Screen Inventory

### Donor App (Mobile + Web)

| Screen | Figma Reference | Priority | Notes |
|--------|-----------------|----------|-------|
| Splash | Splash.png | P1 | Teal gradient with heart logo |
| Login | Homepage.jpg | P1 | Teal header, Individual/Charity toggle |
| Register | Homepage-1.jpg | P1 | Extended form based on user type |
| Home | Home.png | P1 | Greeting, search, horizontal scroll sections |
| Campaign List | See all campaigns.png | P1 | Vertical list with thumbnails |
| Organization List | See all organizations.png | P2 | Similar to campaign list |
| Campaign Detail | Campaign Detail.png | P1 | Video/image, description, donate CTA |
| Organization Detail | Donate.png | P2 | Overview/Posts tabs, services list |
| Donation Flow | (to design) | P1 | Amount selection, payment, confirmation |
| History | History.png | P2 | Simple list of past donations |
| Messages | Messaging Detail.png | P3 | Chat-style messaging |
| Profile/Settings | (to design) | P2 | User preferences, logout |
| Campaign Map | (from CarbonOffset) | P2 | Interactive map with markers |

### Charity Admin Dashboard (Desktop Web)

| Screen | Figma Reference | Priority | Notes |
|--------|-----------------|----------|-------|
| Dashboard Overview | SaaS Dashboard-2.png | P2 | Metrics cards, charts |
| Donations Table | Campaign Dashboard.png | P2 | Filterable donation list |
| Campaign Management | SaaS Dashboard.png | P2 | Campaign cards grid |
| Reports | SaaS Dashboard-2.png | P3 | Income/expense charts |
| Settings | (to design) | P3 | Organization settings |

---

## Navigation Structure

### Mobile (Bottom Tabs)

```
[Home] [Donate] [History] [Messages]
   |       |        |         |
   v       v        v         v
 Home   Campaign  History  Messages
 Feed    List     List      List
           |
           v
        Campaign
         Detail
           |
           v
        Donation
          Flow
```

### Desktop Web (Sidebar + Content)

```
+------------------+--------------------------------+
|  [Logo]          |  [Search]     [Notifications] |
|                  |--------------------------------|
|  [Dashboard]     |                               |
|  [Campaigns]     |      Main Content Area        |
|  [Messages]      |                               |
|  [History]       |                               |
|  [Settings]      |                               |
|                  |                               |
|  [User Avatar]   |                               |
+------------------+--------------------------------+
```

### Responsive Behavior

| Breakpoint | Navigation |
|------------|------------|
| Mobile (<768px) | Bottom tabs |
| Tablet (768-1024px) | Bottom tabs or slim sidebar |
| Desktop (>1024px) | Full sidebar with labels |

---

## Component Architecture

### Project Structure

```
apps/
└── mobile/                          # React Native + Expo
    ├── app/                         # Expo Router (file-based)
    │   ├── (auth)/                  # Auth group
    │   │   ├── _layout.tsx
    │   │   ├── login.tsx
    │   │   └── register.tsx
    │   ├── (app)/                   # Authenticated app
    │   │   ├── _layout.tsx          # Tab layout
    │   │   ├── (tabs)/
    │   │   │   ├── _layout.tsx      # Bottom tabs config
    │   │   │   ├── index.tsx        # Home
    │   │   │   ├── donate.tsx       # Campaign list
    │   │   │   ├── history.tsx      # Donation history
    │   │   │   └── messages.tsx     # Messages
    │   │   ├── campaign/
    │   │   │   └── [id].tsx         # Campaign detail
    │   │   ├── organization/
    │   │   │   └── [id].tsx         # Organization detail
    │   │   ├── donation/
    │   │   │   └── [campaignId].tsx # Donation flow
    │   │   └── map.tsx              # Campaign map
    │   └── _layout.tsx              # Root layout
    │
    ├── components/
    │   ├── ui/                      # Base Tamagui components
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Progress.tsx
    │   │   ├── Avatar.tsx
    │   │   ├── Dialog.tsx
    │   │   └── ...
    │   ├── navigation/
    │   │   ├── TabBar.tsx           # Mobile bottom tabs
    │   │   ├── Sidebar.tsx          # Desktop sidebar
    │   │   └── Header.tsx           # Screen headers
    │   ├── campaigns/
    │   │   ├── CampaignCard.tsx     # List item card
    │   │   ├── CampaignCardRich.tsx # Detailed card with hover
    │   │   ├── CampaignList.tsx     # Vertical list
    │   │   ├── CampaignGrid.tsx     # Grid layout
    │   │   └── CampaignMap.tsx      # Map view
    │   ├── organizations/
    │   │   ├── OrganizationCard.tsx
    │   │   └── OrganizationList.tsx
    │   ├── donations/
    │   │   ├── DonationCard.tsx
    │   │   ├── DonationFlow.tsx
    │   │   └── AmountSelector.tsx
    │   ├── home/
    │   │   ├── Greeting.tsx
    │   │   ├── SearchBar.tsx
    │   │   └── HorizontalSection.tsx
    │   └── auth/
    │       ├── AuthLayout.tsx
    │       ├── UserTypeToggle.tsx
    │       └── SocialLoginButtons.tsx
    │
    ├── features/
    │   ├── auth/
    │   │   ├── AuthContext.tsx
    │   │   ├── useAuth.ts
    │   │   └── authApi.ts
    │   ├── campaigns/
    │   │   ├── useCampaigns.ts
    │   │   ├── useCampaign.ts
    │   │   └── campaignApi.ts
    │   ├── organizations/
    │   │   ├── useOrganizations.ts
    │   │   └── organizationApi.ts
    │   ├── donations/
    │   │   ├── useDonations.ts
    │   │   ├── useDonation.ts
    │   │   └── donationApi.ts
    │   └── user/
    │       ├── useUser.ts
    │       └── userApi.ts
    │
    ├── config/
    │   ├── tamagui.config.ts        # Theme tokens, fonts
    │   ├── api.ts                   # API base URL, interceptors
    │   └── constants.ts             # App constants
    │
    ├── hooks/
    │   ├── useMedia.ts              # Responsive breakpoints
    │   └── useDebounce.ts
    │
    ├── utils/
    │   ├── formatCurrency.ts
    │   ├── formatDate.ts
    │   └── storage.ts               # Secure storage helpers
    │
    ├── assets/
    │   ├── fonts/
    │   └── images/
    │
    ├── app.json                     # Expo config
    ├── package.json
    ├── tsconfig.json
    └── tamagui.config.ts
```

---

## Component Specifications

### CampaignCard (Simple - Figma Style)

Used in: Campaign list, home screen horizontal scroll

```
+------------------------------------------+
|  [Image]                                 |
|  +---------+                             |
|  | 60x60   |  Campaign Title             |
|  |         |  Description snippet that   |
|  +---------+  wraps to multiple lines... |
+------------------------------------------+
```

**Props:**
- `campaign: Campaign`
- `onPress: () => void`
- `variant?: 'list' | 'horizontal'`

### CampaignCardRich (Enhanced - CarbonOffset Style)

Used in: Grid view, featured campaigns

```
+------------------------------------------+
|  [Full-width Image]              [Heart] |
|  [Category Badge]                        |
+------------------------------------------+
|  Campaign Title                          |
|  Organization name                       |
|                                          |
|  Description text...                     |
|                                          |
|  [Progress Bar =========>    ]  75%      |
|  $15,000 raised of $20,000               |
|                                          |
|  [    Donate Now    ]                    |
+------------------------------------------+
```

**Props:**
- `campaign: Campaign`
- `onPress: () => void`
- `onLike?: () => void`
- `showProgress?: boolean`

### Bottom Tab Bar

```
+--------+--------+--------+--------+
|  Home  | Donate | History| Messages|
|  [ic]  |  [ic]  |  [ic]  |  [ic]  |
+--------+--------+--------+--------+
```

**Behavior:**
- Active tab: Teal icon + label
- Inactive: Gray icon + label
- Badge on Messages for unread count

### Desktop Sidebar

```
+----------------+
|    [Logo]      |
+----------------+
|                |
|  [ic] Home     |
|  [ic] Campaigns|
|  [ic] Map      |
|  [ic] History  |
|  [ic] Messages |
|                |
+----------------+
|  [Avatar]      |
|  User Name     |
|  [Settings]    |
+----------------+
```

**Behavior:**
- Collapsed (icons only) on tablet
- Expanded (icons + labels) on desktop
- Active item: Teal background highlight

---

## API Integration

### Existing Endpoints (from .NET API)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/campaigns` | List campaigns |
| GET | `/api/campaigns/{id}` | Campaign detail |
| GET | `/api/organizations` | List organizations |
| GET | `/api/organizations/{id}` | Organization detail |
| POST | `/api/donations` | Create donation |
| GET | `/api/donations/user/{userId}` | User's donation history |

### New Endpoints Needed

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns/map` | Campaigns with coordinates for map |
| GET | `/api/user/profile` | Current user profile |
| PUT | `/api/user/profile` | Update user profile |
| GET | `/api/messages` | User's message threads |
| GET | `/api/messages/{threadId}` | Messages in thread |
| POST | `/api/messages` | Send message |

---

## Migration Plan

### Phase 1: Project Setup (Week 1)
- [ ] Create new Expo project with TypeScript
- [ ] Configure Tamagui with ShiftGiving theme
- [ ] Set up Expo Router navigation structure
- [ ] Configure TanStack Query
- [ ] Set up development environment (simulators, web)

### Phase 2: Core Components (Week 2)
- [ ] Build base UI components (Button, Card, Input, etc.)
- [ ] Build navigation components (TabBar, Sidebar, Header)
- [ ] Implement responsive layout wrapper
- [ ] Create auth context and secure storage

### Phase 3: Auth Flow (Week 2-3)
- [ ] Splash screen
- [ ] Login screen
- [ ] Register screen with user type toggle
- [ ] Connect to existing auth API
- [ ] Protected route handling

### Phase 4: Home & Campaigns (Week 3-4)
- [ ] Home screen with greeting and sections
- [ ] Campaign list (vertical)
- [ ] Campaign card components
- [ ] Campaign detail screen
- [ ] Organization list and detail

### Phase 5: Donations (Week 4-5)
- [ ] Donation flow screens
- [ ] Payment integration (Stripe)
- [ ] Donation history
- [ ] Donation confirmation

### Phase 6: Enhanced Features (Week 5-6)
- [ ] Campaign map (from CarbonOffset)
- [ ] Messages screen
- [ ] Profile/Settings
- [ ] Push notifications setup

### Phase 7: Admin Dashboard (Week 6-7)
- [ ] Dashboard overview with metrics
- [ ] Donations table
- [ ] Campaign management
- [ ] Desktop-only layouts

### Phase 8: Polish & Launch (Week 7-8)
- [ ] Animation refinements
- [ ] Performance optimization
- [ ] Testing (unit, integration, e2e)
- [ ] App store submissions
- [ ] Web deployment

---

## Answered Questions

### Messages & Notifications

**Messages feature scope:**
- One-way communication: Organizations → Donors only
- Example: "We need baby formula at our food pantry"
- Donors can interact via: Heart (like) or Share to social media
- Not bi-directional chat

**Notification system:**
- Appears in Messages tab in-app
- Push notifications to device (MVP)
- Events include: campaign updates, donation confirmations, goal reached, new messages, etc.
- Design the notification system now; configure specific events/schedules later

### Search & Offline

**Search:** Global search across campaigns, organizations, all content

**Offline support:**
- View cached campaigns only
- Payments disabled offline (requires gateway verification)

### Payments

**Payment processors (all for MVP):**
- Stripe (primary)
- Apple Pay
- Google Pay
- PayPal

**Fee structure:**
- 2.9% transaction fee
- $0.50 platform convenience fee
- Option for donor to cover fees (shown on donation card)

### User Types & Roles

```
A. Site Admin
   - Platform-wide administration

B. Organization Roles
   ├── Org Admin
   │   └── Full organization management
   ├── Marketing Admin
   │   └── Push notifications to donors
   │   └── Cannot manage donations
   │   └── Uses content from coordinators
   └── Coordinator
       └── Upload content to media portal
       └── Field work (events, filming)
       └── Content available to Marketing Admin

C. Donor
   - Individual donors

D. Corporate (Future - not MVP)
   - Corporate giving programs
```

### Organization Verification

**MVP:** Manual verification process
**Future:** Automated verification against government 501(c)(3) database

**Flow:**
1. Organization signs up
2. Pending verification status
3. Manual review by Site Admin
4. Once verified, org card goes live on platform
5. Platform is exclusively for 501(c)(3) organizations

### Internationalization

| Version | Scope |
|---------|-------|
| MVP | USD only, English only |
| V2-V3 | Multi-currency, multi-lingual |

### Analytics & Error Tracking

- **Analytics:** TBD (recommendations welcome) - post-MVP, stub out
- **Error Tracking:** Sentry - post-MVP, stub out

---

## MVP Scope Definition

### Core Features (MVP)

| Feature | Size | Priority |
|---------|------|----------|
| Login / Authentication | S | P1 |
| Payments (Stripe, Apple Pay, Google Pay, PayPal) | L | P1 |
| Backend API | L | P1 |
| Mobile App Shell | M | P1 |
| Viewing Organization/Campaign Information | M | P1 |
| Simple Campaigns | M | P1 |
| Rich Storytelling Capabilities | M | P1 |
| Donor Portal & Login | M | P1 |
| Organization Online Sign Up | M | P1 |
| Push Notifications | M | P1 |
| Multi-tenancy | M | P1 |

### Administrative Features (MVP)

| Feature | Size | Priority |
|---------|------|----------|
| Dashboard | S | P1 |
| Organization Management | S | P1 |
| Campaign/Messages Management | L | P1 |
| On-Demand Social Messaging | M | P1 |
| Payment/Billing Management | M | P1 |

### Deferred to Post-MVP

- Corporate donor accounts
- Automated 501(c)(3) verification
- Multi-currency support
- Multi-lingual support
- Advanced analytics
- Coordinator content portal (or simplified for MVP?)

---

## Additional Answered Questions

### Coordinator Content Portal

**Status:** Deferred to V2
- Not in MVP scope
- Will include media library and image optimization (reference CarbonOffset implementation)

### Organization Onboarding

**Information collected:**

- Organization name
- 501(c)(3) number
- Years in business
- Ownership information
- Contact information (primary)
- Billing contact
- Marketing contact
- Website URL
- Bank account for payouts

### Campaign Creation (Rich Storytelling)

**Capabilities:**

- Images (with optimization)
- Videos
- Text blocks
- Templates
- Media portal for content management
- Reference: CarbonOffset's media portal and image optimization tool

### Donation Receipts

- Auto-generated PDF receipts
- Email delivery to donor
- Annual summary for tax purposes

### Payout Schedule

- **Hold period:** 15 days minimum (protects against chargebacks)
- **Payout window:** 15-30 days after transaction
- **Rationale:** Prevents issues with credit card transaction reversals due to insufficient funds

### Site Admin Features

**Full administrative control:**

- CRUD operations on all campaigns
- Content moderation and monitoring
- User impersonation (for support/debugging)
- Organization impersonation
- Full user management
- Content approval/rejection capabilities
- Platform-wide oversight

**Rationale:** Prevent rogue organizations from posting unapproved content

### Branding

- **Logo:** Two hearts logo (as seen in Figma)
- **Name:** "Shift Giving" for now
- **Note:** Platform may be white-labeled in the future (design for configurability)

---

## Reference Projects

### CarbonOffset (Local)
- **Location:** `/Users/justynmiller/Desktop/Projects/CarbonOffset`
- **Key files to reference:**
  - `client/src/components/Globe.tsx` - Map implementation
  - `client/src/components/ProjectCard.tsx` - Rich card with animations
  - `client/src/components/Sidebar.tsx` - Desktop navigation
  - `client/src/components/MetricsGrid.tsx` - Dashboard metrics
  - `client/src/pages/dashboard.tsx` - Layout patterns

### Figma Designs
- **Location:** `/ShiftGivesFigma/`
- **Key screens:**
  - `Home.png` - Mobile home screen
  - `Homepage.jpg` - Auth flow (login)
  - `Homepage-1.jpg` - Auth flow (register)
  - `Campaign Detail.png` - Campaign detail
  - `See all campaigns.png` - Campaign list
  - `History.png` - Donation history
  - `SaaS Dashboard-2.png` - Admin dashboard
  - `Splash.png` - Splash screen

---

## Appendix: Tamagui Theme Configuration

```typescript
// config/tamagui.config.ts
import { createTamagui, createTokens } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'

const interFont = createInterFont()

const tokens = createTokens({
  color: {
    // Primary
    primary: '#00a0c4',
    primaryHover: '#008ba8',
    primaryLight: '#e0f4f8',

    // Backgrounds
    background: '#ffffff',
    backgroundPage: '#f5f5f5',
    backgroundCard: '#ffffff',

    // Text
    textPrimary: '#1a1a1a',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    textInverse: '#ffffff',

    // Borders
    border: '#e5e7eb',
    borderLight: '#f3f4f6',

    // Status
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',

    // Categories
    categoryEducation: '#3b82f6',
    categoryHealth: '#ef4444',
    categoryEnvironment: '#22c55e',
    categoryHumanitarian: '#f59e0b',
    categoryCommunity: '#8b5cf6',
    categoryAnimals: '#ec4899',
    categoryArts: '#06b6d4',
    categoryReligious: '#6366f1',
  },

  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
  },

  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
  },

  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    full: 9999,
  },

  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
})

export const config = createTamagui({
  tokens,

  themes: {
    light: {
      background: tokens.color.background,
      backgroundPage: tokens.color.backgroundPage,
      backgroundCard: tokens.color.backgroundCard,
      color: tokens.color.textPrimary,
      colorSecondary: tokens.color.textSecondary,
      colorTertiary: tokens.color.textTertiary,
      primary: tokens.color.primary,
      primaryHover: tokens.color.primaryHover,
      borderColor: tokens.color.border,
      borderColorLight: tokens.color.borderLight,
    },
    dark: {
      background: '#0f0f0f',
      backgroundPage: '#1a1a1a',
      backgroundCard: '#262626',
      color: '#ffffff',
      colorSecondary: '#a1a1aa',
      colorTertiary: '#71717a',
      primary: tokens.color.primary,
      primaryHover: tokens.color.primaryHover,
      borderColor: '#3f3f46',
      borderColorLight: '#27272a',
    },
  },

  fonts: {
    heading: interFont,
    body: interFont,
  },

  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
})

export type AppConfig = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
```

---

## Document History

| Date | Author | Changes |
|------|--------|---------|
| 2025-01-18 | Claude + Justin | Initial planning document |
