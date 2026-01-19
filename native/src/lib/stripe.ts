import {
  stripe,
  StripeError,
  initStripe,
  useStripe,
  CardFieldInput,
  PlatformPay,
  ApplePay,
  GooglePay,
} from '@stripe/stripe-react-native';

let stripeInitialized = false;

export const initializeStripe = async (publishableKey: string): Promise<void> => {
  if (stripeInitialized) {
    return;
  }

  try {
    await initStripe({
      publishableKey,
      merchantIdentifier: 'merchant.com.shiftgiving',
    });
    stripeInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    stripeInitialized = false;
    throw new Error('Stripe initialization failed');
  }
};

export const createPaymentIntent = async (
  amount: number,
  currency: string,
  token: string
): Promise<{ clientSecret: string; publishableKey: string }> => {
  try {
    const response = await fetch('/api/payments/intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error(`Payment intent creation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create payment intent:', error);
    throw error;
  }
};

export interface PaymentMethodParams {
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

export const createCardPaymentMethod = async (
  params: PaymentMethodParams
): Promise<{ paymentMethodId: string }> => {
  try {
    const response = await fetch('/api/payments/payment-method', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'card',
        card: {
          number: params.cardNumber,
          exp_month: params.expMonth,
          exp_year: params.expYear,
          cvc: params.cvc,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Payment method creation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { paymentMethodId: data.id };
  } catch (error) {
    console.error('Failed to create payment method:', error);
    throw error;
  }
};

export interface ConfirmPaymentParams {
  clientSecret: string;
  paymentMethodId: string;
}

export const confirmPayment = async (
  params: ConfirmPaymentParams
): Promise<{ success: boolean; paymentIntentId: string }> => {
  try {
    const { clientSecret, paymentMethodId } = params;

    const response = await fetch('/api/payments/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientSecret,
        paymentMethodId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Payment confirmation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: data.status === 'succeeded',
      paymentIntentId: data.id,
    };
  } catch (error) {
    console.error('Failed to confirm payment:', error);
    throw error;
  }
};

export const checkApplePayAvailability = async (): Promise<boolean> => {
  try {
    const available = await ApplePay.isApplePaySupported();
    return available;
  } catch (error) {
    console.error('Failed to check Apple Pay availability:', error);
    return false;
  }
};

export const checkGooglePayAvailability = async (): Promise<boolean> => {
  try {
    const available = await GooglePay.isGooglePaySupported();
    return available;
  } catch (error) {
    console.error('Failed to check Google Pay availability:', error);
    return false;
  }
};

export interface ApplePayParams {
  clientSecret: string;
  amount: number;
  currency: string;
  campaignName: string;
}

export const presentApplePay = async (params: ApplePayParams): Promise<{
  success: boolean;
  paymentIntentId: string;
}> => {
  try {
    const { clientSecret, amount, currency, campaignName } = params;

    const result = await ApplePay.presentApplePay({
      cartItems: [
        {
          label: campaignName,
          amount: (amount / 100).toFixed(2),
          paymentType: 'Immediate',
        },
      ],
      country: 'US',
      currency,
      requiredBillingContactFields: ['postalAddress', 'name'],
      requiredShippingContactFields: ['postalAddress', 'name'],
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      success: result.paymentMethod !== null,
      paymentIntentId: '',
    };
  } catch (error) {
    console.error('Apple Pay failed:', error);
    throw error;
  }
};

export interface GooglePayParams {
  clientSecret: string;
  amount: number;
  currency: string;
  campaignName: string;
}

export const presentGooglePay = async (params: GooglePayParams): Promise<{
  success: boolean;
  paymentIntentId: string;
}> => {
  try {
    const { clientSecret, amount, currency, campaignName } = params;

    const result = await GooglePay.presentGooglePay({
      clientSecret,
      forSetupIntent: false,
      currencyCode: currency,
      amount: Math.round(amount),
      label: campaignName,
      merchantName: 'ShiftGiving',
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      success: result.paymentMethod !== null,
      paymentIntentId: '',
    };
  } catch (error) {
    console.error('Google Pay failed:', error);
    throw error;
  }
};

export const handlePaymentError = (error: StripeError | Error): string => {
  if ('code' in error && error.code) {
    const stripeError = error as StripeError;
    return stripeError.message || 'An error occurred while processing your payment';
  }
  return error.message || 'An unknown error occurred';
};
