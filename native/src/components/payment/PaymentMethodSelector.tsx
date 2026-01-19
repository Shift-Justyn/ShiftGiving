import React, { useEffect, useState } from 'react';
import { Platform, Pressable } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { checkApplePayAvailability, checkGooglePayAvailability } from '../../lib/stripe';

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

const MethodOption: React.FC<{
  label: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
}> = ({ label, description, isSelected, onPress, disabled }) => (
  <Pressable onPress={onPress} disabled={disabled || false}>
    <XStack
      paddingHorizontal="$3"
      paddingVertical="$3"
      borderRadius="$2"
      borderWidth={1}
      borderColor={isSelected ? '#008B8B' : '#E5E7EB'}
      backgroundColor={isSelected ? '#F0FFFE' : '#FFFFFF'}
    >
      <YStack marginLeft="$3" flex={1}>
        <Text fontWeight="600" fontSize="$4">
          {label}
        </Text>
        <Text fontSize="$2" color="#666666">
          {description}
        </Text>
      </YStack>
    </XStack>
  </Pressable>
);

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  disabled = false,
}) => {
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializePaymentMethods = async () => {
      if (Platform.OS === 'ios') {
        const available = await checkApplePayAvailability();
        if (isMounted) setApplePayAvailable(available);
      } else if (Platform.OS === 'android') {
        const available = await checkGooglePayAvailability();
        if (isMounted) setGooglePayAvailable(available);
      }
    };

    initializePaymentMethods();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <YStack space="$4">
      <Text fontSize="$5" fontWeight="600" color="#000000">
        Payment Method
      </Text>

      <YStack space="$3">
        <MethodOption
          label="Credit Card"
          description="Visa, Mastercard, Amex"
          isSelected={selectedMethod === 'card'}
          onPress={() => onMethodChange('card')}
          disabled={disabled}
        />

        {applePayAvailable && Platform.OS === 'ios' && (
          <MethodOption
            label="Apple Pay"
            description="Fast and secure"
            isSelected={selectedMethod === 'apple_pay'}
            onPress={() => onMethodChange('apple_pay')}
            disabled={disabled}
          />
        )}

        {googlePayAvailable && Platform.OS === 'android' && (
          <MethodOption
            label="Google Pay"
            description="Quick checkout"
            isSelected={selectedMethod === 'google_pay'}
            onPress={() => onMethodChange('google_pay')}
            disabled={disabled}
          />
        )}
      </YStack>
    </YStack>
  );
};
