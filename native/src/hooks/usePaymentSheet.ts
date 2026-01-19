import { useState, useCallback } from 'react';
import { useStripe } from '@stripe/stripe-react-native';

export interface PaymentSheetParams {
  clientSecret: string;
  merchantDisplayName?: string;
  merchantCountryCode?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

export const usePaymentSheet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePaymentSheet = useCallback(
    async (params: PaymentSheetParams): Promise<boolean> => {
      try {
        setError(null);
        setLoading(true);

        const { clientSecret, merchantDisplayName = 'ShiftGiving', merchantCountryCode = 'US' } = params;

        const result = await initPaymentSheet({
          clientSecret,
          merchantDisplayName,
          merchantCountryCode,
          defaultBillingDetails: {
            name: '',
            email: '',
          },
          googlePay: {
            enabled: true,
            countryCode: merchantCountryCode,
          },
          applePay: {
            enabled: true,
            merchantCountryCode,
          },
          returnURL: 'shiftgiving://payment-confirmation',
        });

        if (result.error) {
          setError(result.error.message);
          return false;
        }

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment sheet';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [initPaymentSheet]
  );

  const presentSheet = useCallback(async (): Promise<PaymentResult> => {
    try {
      setError(null);
      setLoading(true);

      const result = await presentPaymentSheet();

      if (result.error) {
        setError(result.error.message);
        return {
          success: false,
          error: result.error.message,
        };
      }

      return {
        success: true,
        paymentIntentId: result.paymentIntent?.id,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [presentPaymentSheet]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    initializePaymentSheet,
    presentSheet,
    loading,
    error,
    resetError,
  };
};
