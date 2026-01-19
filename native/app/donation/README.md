# Donation Flow

This directory contains the complete end-to-end donation experience for the Shift Giving mobile app.

## Flow Overview

1. **Amount Selection** (`[campaignId].tsx`)
   - User selects from preset amounts ($25, $50, $100, $200) or enters custom amount
   - Amount validation (min $5, max $10,000)
   - Option to cover transaction fees (2.9% + $0.30)
   - Shows campaign info and real-time total calculation

2. **Payment Method** (`payment.tsx`)
   - Credit/Debit Card payment form with validation
   - Apple Pay support (iOS only)
   - Google Pay support (Android only)
   - Card number formatting (adds spaces every 4 digits)
   - Expiry date formatting (MM/YY)
   - CVV with secure entry
   - Order summary with fee breakdown

3. **Confirmation** (`confirmation.tsx`)
   - Success animation with checkmark
   - Donation amount display
   - Receipt details (date, confirmation ID, payment method)
   - Download receipt button
   - Share donation on social media
   - Return home button

## Files Created

### Screens
- `app/donation/[campaignId].tsx` - Amount selection screen
- `app/donation/payment.tsx` - Payment method screen
- `app/donation/confirmation.tsx` - Confirmation screen

### Utilities
- `src/lib/fees.ts` - Fee calculation utilities
  - `calculateTransactionFee(amount)` - Calculates 2.9% + $0.30 fee
  - `calculateTotal(amount, includeFees)` - Calculates total with optional fees
  - `formatCurrency(value)` - Formats numbers as US currency

### Validation
- `src/lib/validation.ts` - Zod schemas for donation validation
  - `donationAmountSchema` - Validates amount between $5-$10,000
  - `paymentCardSchema` - Validates card number, expiry, CVV, cardholder name

### Hooks
- `src/hooks/useDonation.ts` - React Query mutation hook for creating donations

### Types
- `src/api/types.ts` - Added `PaymentMethod` enum (Card, ApplePay, GooglePay)

### Tests
- `src/lib/__tests__/fees.test.ts` - Fee calculation tests (4 tests, all passing)
- `src/lib/__tests__/validation.test.ts` - Validation schema tests (7 tests, all passing)
- `src/hooks/__tests__/useDonation.test.ts` - Donation hook tests
- `app/donation/__tests__/[campaignId].test.tsx` - Amount selection screen tests
- `app/donation/__tests__/payment.test.tsx` - Payment screen tests
- `app/donation/__tests__/confirmation.test.tsx` - Confirmation screen tests

## Navigation Flow

```
CampaignDetailScreen
  └─> Click "Donate" button
      └─> DonationAmountScreen (/donation/[campaignId])
          └─> Click "Continue to Payment"
              └─> PaymentScreen (/donation/payment)
                  └─> Click "Donate $X"
                      └─> ConfirmationScreen (/donation/confirmation)
                          └─> Click "Return Home"
                              └─> HomeScreen (/)
```

## Features

### Amount Selection
- 4 preset amounts for quick selection
- Custom amount input with real-time validation
- Transaction fee toggle with cost preview
- Campaign info header
- Running total calculation

### Payment
- Multiple payment methods (Card, Apple Pay, Google Pay)
- Card number formatting (automatic spacing)
- Expiry date formatting (MM/YY)
- CVV secure input
- Form validation before submission
- Loading state during submission
- Error handling with user feedback

### Confirmation
- Animated success checkmark
- Large donation amount display
- Detailed receipt information
- Download receipt functionality
- Social sharing options
- Thank you message

## Design Patterns

### Carbon-Inspired UI
- Clean card-based layouts
- Teal accent color for primary actions
- Clear visual hierarchy
- Smooth animations using Moti
- Consistent spacing and typography

### Form Validation
- Real-time validation feedback
- Clear error messages
- Disabled states for invalid forms
- Input formatting for better UX

### Error Handling
- User-friendly error messages
- Retry capabilities
- Loading states during async operations
- Graceful fallbacks

## Testing

All core utilities and validation logic have comprehensive test coverage:

```bash
npm test -- src/lib/__tests__/fees.test.ts
npm test -- src/lib/__tests__/validation.test.ts
```

## Integration

The donation flow is integrated with the existing app:
- Campaign detail screen updated to link to `/donation/[campaignId]`
- Uses existing authentication context (token required)
- Uses existing API client and donation endpoints
- Follows existing routing patterns with expo-router

## Future Enhancements

- Real Stripe integration (currently mock payment)
- Recurring donation support
- Donation history integration
- Tax receipt generation
- Multiple currency support
- Anonymous donation option
- Donor message to organization
