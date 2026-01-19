import React, { useEffect, useState } from 'react';
import { Button, YStack, Text, Spinner } from 'tamagui';
import { Platform } from 'react-native';
import { GooglePay } from '@stripe/stripe-react-native';

interface GooglePayButtonProps {
  amount: number;
  currency: string;
  campaignName: string;
  clientSecret?: string;
  onPaymentStart?: () => void;
  onPaymentSuccess?: (paymentIntentId: string) => void;
  onPaymentError?: (error: string) => void;
  disabled?: boolean;
}

export const GooglePayButton: React.FC<GooglePayButtonProps> = ({
  amount,
  currency,
  campaignName,
  clientSecret,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
}) => {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkGooglePayAvailability();
  }, []);

  const checkGooglePayAvailability = async () => {
    if (Platform.OS !== 'android') {
      setAvailable(false);
      return;
    }

    try {
      const isSupported = await GooglePay.isGooglePaySupported();
      setAvailable(isSupported);
    } catch (error) {
      console.error('Failed to check Google Pay availability:', error);
      setAvailable(false);
    }
  };

  const handleGooglePayPress = async () => {
    if (!available || disabled || !clientSecret) return;

    try {
      setLoading(true);
      onPaymentStart?.();

      const result = await GooglePay.presentGooglePay({
        clientSecret,
        forSetupIntent: false,
        currencyCode: currency,
        amount: Math.round(amount),
        label: campaignName,
        merchantName: 'ShiftGiving',
      });

      if (result.error) {
        onPaymentError?.(result.error.message);
      } else if (result.paymentMethod) {
        onPaymentSuccess?.('');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google Pay payment failed';
      onPaymentError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!available || Platform.OS !== 'android') {
    return null;
  }

  return (
    <YStack space="$2">
      <Button
        onPress={handleGooglePayPress}
        disabled={disabled || loading || !clientSecret}
        backgroundColor="#1F2937"
        borderRadius="$3"
        padding="$4"
        icon={loading ? <Spinner color="#FFFFFF" /> : undefined}
      >
        <Text color="#FFFFFF" fontWeight="600" fontSize="$5">
          {loading ? 'Processing...' : 'Pay with Google Pay'}
        </Text>
      </Button>
    </YStack>
  );
};
