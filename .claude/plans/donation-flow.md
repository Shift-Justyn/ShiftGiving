# Donation Flow Implementation Plan

## Overview

Implement the complete donation flow for Shift Giving, connecting the existing backend donation endpoints to a new frontend user experience.

## Current State

**Backend (Complete)**:
- POST /api/donations - Create donation (requires auth)
- GET /api/donations/{id} - Get donation by ID
- GET /api/donations/user/{userId} - Get user's donations
- GET /api/donations/campaign/{campaignId} - Get campaign donations
- GET /api/donations/campaign/{campaignId}/summary - Get campaign summary
- PaymentService with mocked Stripe integration

**Frontend (Incomplete)**:
- CampaignDetailPage has "Donate Now" button with no handler
- No donation-related pages, components, or API client

## Implementation Plan

### Phase 1: API Client & Types

**Files to create:**
- `web/src/api/donations.ts` - Donation API client functions
- `web/src/api/types.ts` - Add donation types (CreateDonationRequest, Donation, DonationSummary)

**Types needed:**
```typescript
interface CreateDonationRequest {
  campaignId: string;
  amount: number;
  isAnonymous: boolean;
  message?: string;
}

interface Donation {
  id: string;
  campaignId: string;
  userId: string;
  amount: number;
  isAnonymous: boolean;
  message?: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
}
```

### Phase 2: Donation Pages

**Files to create:**

1. `web/src/pages/DonationPage.tsx`
   - Amount selection (preset buttons + custom input)
   - Anonymous donation toggle
   - Optional message field
   - Campaign summary sidebar
   - "Continue to Payment" button

2. `web/src/pages/PaymentPage.tsx`
   - Payment form (card number, expiry, CVV)
   - Order summary
   - "Complete Donation" button
   - Note: Uses mocked payment processing

3. `web/src/pages/DonationConfirmationPage.tsx`
   - Success message with donation details
   - Link to view donation history
   - Link to return to campaigns

### Phase 3: Router Updates

**File to modify:**
- `web/src/router/AppRouter.tsx` - Add routes:
  - `/campaigns/:id/donate` - DonationPage
  - `/campaigns/:id/donate/payment` - PaymentPage
  - `/donations/:id/confirmation` - DonationConfirmationPage

### Phase 4: Integration

**Files to modify:**
- `web/src/pages/CampaignDetailPage.tsx` - Wire "Donate Now" button to navigate to donation page

### Phase 5: Tests

**Files to create:**
- `web/src/api/__tests__/donations.test.ts`
- `web/src/pages/__tests__/DonationPage.test.tsx`
- `web/src/pages/__tests__/PaymentPage.test.tsx`
- `web/src/pages/__tests__/DonationConfirmationPage.test.tsx`

## Critical Files

- `web/src/api/client.ts` - Base API client (reference for new API functions)
- `web/src/api/types.ts` - Existing types to extend
- `web/src/pages/CampaignDetailPage.tsx` - "Donate Now" button location
- `web/src/router/AppRouter.tsx` - Route configuration
- `web/src/i18n/locales/en-US.json` - Translation keys to add
- `api/ShiftGiving/Endpoints/DonationEndpoints.cs` - API contract reference

## Verification

1. Run existing tests: `cd web && npm test`
2. Start local services: `./scripts/start-local.sh`
3. Manual test flow:
   - Navigate to a campaign detail page
   - Click "Donate Now"
   - Enter amount, toggle anonymous, add message
   - Click "Continue to Payment"
   - Enter test card details
   - Click "Complete Donation"
   - Verify confirmation page shows donation details
4. Run new tests: `cd web && npm test`
5. Check coverage: `cd web && npm run test:coverage`
