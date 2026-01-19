# Stripe React Native Integration

This document outlines the Stripe payment integration for the ShiftGiving Expo app.

## Overview

Stripe React Native SDK (v0.50.3) has been integrated to enable payment processing through:
- Credit/Debit cards
- Apple Pay (iOS)
- Google Pay (Android)

## Installation & Configuration

### 1. Dependencies
```bash
npx expo install @stripe/stripe-react-native
```

The package is installed in `package.json` as:
```json
"@stripe/stripe-react-native": "0.50.3"
```

### 2. Expo Configuration (app.json)

Added Stripe plugin and iOS merchant configuration:
```json
{
  "ios": {
    "supportsTablet": true,
    "merchant": "merchant.com.shiftgiving"
  },
  "plugins": [
    "@stripe/stripe-react-native",
    {
      "merchantIdentifier": "merchant.com.shiftgiving",
      "enableGooglePay": true
    }
  ]
}
```

### 3. Provider Setup (app/_layout.tsx)

Wrapped the app with `StripeProvider`:
```tsx
<StripeProvider publishableKey="pk_test_placeholder">
  {/* App content */}
</StripeProvider>
```

**Important**: Replace `pk_test_placeholder` with your actual Stripe publishable key.

## Architecture

### Services (`src/lib/stripe.ts`)

Core Stripe integration functions:
- `initializeStripe(publishableKey)` - Initialize Stripe SDK
- `createPaymentIntent(amount, currency, token)` - Create server-side payment intent
- `createCardPaymentMethod(params)` - Create payment method from card details
- `confirmPayment(params)` - Confirm payment with client secret and payment method
- `checkApplePayAvailability()` - Check iOS Apple Pay availability
- `checkGooglePayAvailability()` - Check Android Google Pay availability
- `presentApplePay(params)` - Present Apple Pay sheet
- `presentGooglePay(params)` - Present Google Pay sheet
- `handlePaymentError(error)` - Format error messages

### Hooks (`src/hooks/usePaymentSheet.ts`)

React hook for payment sheet management:
- `usePaymentSheet()` - Hook for managing payment sheet state
  - `initializePaymentSheet(params)` - Initialize with client secret
  - `presentSheet()` - Present sheet and handle payment
  - `loading` - Loading state during payment
  - `error` - Error state and message
  - `resetError()` - Clear error state

### Components

#### CardForm (`src/components/payment/CardForm.tsx`)
- Stripe CardField component with validation
- Shows card validity feedback
- Teal accent color (#008B8B) matching app theme
- Supports postal code entry

Props:
- `onCardChange?: (valid: boolean) => void` - Called when card validity changes
- `onCardDataChange?: (data: Partial<CardFormData>) => void` - Called with card details
- `disabled?: boolean` - Disable input

#### ApplePay (`src/components/payment/ApplePay.tsx`)
- Apple Pay button for iOS only
- Checks availability on component mount
- Shows loading state during payment
- Callbacks: `onPaymentStart`, `onPaymentSuccess`, `onPaymentError`

#### GooglePay (`src/components/payment/GooglePay.tsx`)
- Google Pay button for Android only
- Requires client secret for payment processing
- Shows loading state during payment
- Callbacks: `onPaymentStart`, `onPaymentSuccess`, `onPaymentError`

#### PaymentMethodSelector (`src/components/payment/PaymentMethodSelector.tsx`)
- Presents radio-style payment method selection
- Displays available options based on platform
- Shows Apple Pay only on iOS, Google Pay only on Android
- Always shows credit card option

Props:
- `selectedMethod: PaymentMethod` - Current selection ('card' | 'apple_pay' | 'google_pay')
- `onMethodChange: (method: PaymentMethod) => void` - Callback on selection
- `disabled?: boolean` - Disable selection

## Testing

### Test Files
- `src/lib/stripe.test.ts` - Service tests (payment intent, availability checks, error handling)
- `src/hooks/usePaymentSheet.test.ts` - Hook tests (initialization, presentation, loading states)
- `src/components/payment/CardForm.test.tsx` - Component tests (rendering, validation)
- `src/components/payment/PaymentMethodSelector.test.tsx` - Component tests (method selection)

### Mocking
Jest mocks are configured in `jest.setup.js`:
- `@stripe/stripe-react-native` module is fully mocked
- `CardField` mock simulates card validation
- `ApplePay` and `GooglePay` mocks resolve successfully
- `useStripe` hook mock includes `initPaymentSheet` and `presentPaymentSheet`

### Running Tests
```bash
npm test                              # Run all tests
npm test -- --testPathPattern=stripe  # Run Stripe-specific tests
npm test:coverage                     # Run with coverage reporting
```

**Status**: All 143 tests pass

## Test Cards

Use these Stripe test cards for development:

| Card Number | Type | Expiry | CVC |
|-------------|------|--------|-----|
| 4242 4242 4242 4242 | Visa | Any future | Any 3-digit |
| 5555 5555 5555 4444 | Mastercard | Any future | Any 3-digit |
| 3782 822463 10005 | Amex | Any future | Any 4-digit |

## Integration Points

### Backend API
The service expects these endpoints:
- `POST /api/payments/intent` - Create payment intent
  - Request: `{ amount: number, currency: string }`
  - Response: `{ clientSecret: string, publishableKey: string }`

- `POST /api/payments/payment-method` - Create payment method
  - Request: Card details object
  - Response: `{ id: string }`

- `POST /api/payments/confirm` - Confirm payment
  - Request: `{ clientSecret: string, paymentMethodId: string }`
  - Response: `{ status: string, id: string }`

### Environment Variables
Add to `.env` or configure in app settings:
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (pk_test_... for development)
- `STRIPE_SECRET_KEY` - Stripe secret key (backend only)

## Usage Example

```tsx
import { CardForm } from '@/components/payment/CardForm';
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector';
import { usePaymentSheet } from '@/hooks/usePaymentSheet';
import { createPaymentIntent } from '@/lib/stripe';

export const DonationScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { initializePaymentSheet, presentSheet } = usePaymentSheet();

  const handleDonate = async (amount: number) => {
    const { clientSecret } = await createPaymentIntent(
      amount,
      'USD',
      authToken
    );

    const initialized = await initializePaymentSheet({
      clientSecret,
      merchantDisplayName: 'ShiftGiving',
    });

    if (initialized) {
      const result = await presentSheet();
      if (result.success) {
        // Handle success
      }
    }
  };

  return (
    <>
      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodChange={setPaymentMethod}
      />
      {paymentMethod === 'card' && <CardForm />}
    </>
  );
};
```

## Key Implementation Details

### State Management
- Uses React hooks for component state
- Zustand for app-wide state (auth, donations)
- React Query for API data fetching

### Error Handling
- All async operations wrapped in try-catch
- Errors logged to console
- User-friendly error messages displayed
- Graceful fallbacks for availability checks

### Security Notes
- Never store full card numbers (Stripe handles this)
- Always use HTTPS for payment processing
- Publishable key is safe to include in client code
- Secret key must stay on backend
- Client secrets are short-lived and single-use

### Platform Handling
- Apple Pay: iOS only, checked at runtime
- Google Pay: Android only, checked at runtime
- Card form: Available on all platforms
- Automatic fallback to card form if wallet unavailable

## Next Steps

1. **Replace Test Key**: Update `publishableKey` in `app/_layout.tsx` with production/test Stripe key
2. **Implement Backend Endpoints**: Create API endpoints for payment intent, payment method, and confirmation
3. **Complete Donation Flow**: Wire components into donation page
4. **Add Error Handling UI**: Create error boundary and user feedback screens
5. **Webhook Configuration**: Set up Stripe webhooks for payment events
6. **Compliance**: Ensure PCI DSS compliance for payment handling

## References

- [Stripe React Native Documentation](https://stripe.com/docs/stripe-js/react-native)
- [Stripe Payment Intent API](https://stripe.com/docs/payments/payment-intents)
- [Apple Pay Integration](https://stripe.com/docs/stripe-js/react-native/apple-pay)
- [Google Pay Integration](https://stripe.com/docs/stripe-js/react-native/google-pay)
