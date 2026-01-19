import React, { useEffect, useState } from 'react';
import { Button, YStack, Text, Spinner } from 'tamagui';
import { Platform } from 'react-native';
import { ApplePay } from '@stripe/stripe-react-native';

interface ApplePayButtonProps {
  amount: number;
  currency: string;
  campaignName: string;
  onPaymentStart?: () => void;
  onPaymentSuccess?: (paymentIntentId: string) => void;
  onPaymentError?: (error: string) => void;
  disabled?: boolean;
}

export const ApplePayButton: React.FC<ApplePayButtonProps> = ({
  amount,
  currency,
  campaignName,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
}) => {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkApplePayAvailability();
  }, []);

  const checkApplePayAvailability = async () => {
    if (Platform.OS !== 'ios') {
      setAvailable(false);
      return;
    }

    try {
      const isSupported = await ApplePay.isApplePaySupported();
      setAvailable(isSupported);
    } catch (error) {
      console.error('Failed to check Apple Pay availability:', error);
      setAvailable(false);
    }
  };

  const handleApplePayPress = async () => {
    if (!available || disabled) return;

    try {
      setLoading(true);
      onPaymentStart?.();

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
        onPaymentError?.(result.error.message);
      } else if (result.paymentMethod) {
        onPaymentSuccess?.('');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Apple Pay payment failed';
      onPaymentError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!available || Platform.OS !== 'ios') {
    return null;
  }

  return (
    <YStack space="$2">
      <Button
        onPress={handleApplePayPress}
        disabled={disabled || loading}
        backgroundColor="#000000"
        borderRadius="$3"
        padding="$4"
        icon={loading ? <Spinner color="#FFFFFF" /> : undefined}
      >
        <Text color="#FFFFFF" fontWeight="600" fontSize="$5">
          {loading ? 'Processing...' : 'Pay with Apple Pay'}
        </Text>
      </Button>
    </YStack>
  );
};
