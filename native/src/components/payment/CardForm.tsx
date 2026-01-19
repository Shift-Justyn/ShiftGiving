import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CardField, CardFieldInput } from '@stripe/stripe-react-native';
import { YStack, Text } from 'tamagui';

export interface CardFormData {
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  postalCode: string;
}

interface CardFormProps {
  onCardChange?: (valid: boolean) => void;
  onCardDataChange?: (data: Partial<CardFormData>) => void;
  disabled?: boolean;
}

export const CardForm: React.FC<CardFormProps> = ({
  onCardChange,
  onCardDataChange,
  disabled = false,
}) => {
  const [cardValid, setCardValid] = useState(false);
  const [cardDetails, setCardDetails] = useState<Partial<CardFormData>>({});

  const handleCardChange = (details: CardFieldInput.Details) => {
    const isValid = details.complete === true;
    setCardValid(isValid);

    if (details.cardDetails) {
      const newDetails = {
        cardNumber: details.cardDetails.number || '',
        expMonth: details.cardDetails.expMonth || 0,
        expYear: details.cardDetails.expYear || 0,
        cvc: details.cardDetails.cvc || '',
        postalCode: details.cardDetails.postalCode || '',
      };
      setCardDetails(newDetails);
      onCardDataChange?.(newDetails);
    }

    onCardChange?.(isValid);
  };

  return (
    <YStack space="$3">
      <View style={styles.container}>
        <CardField
          postalCodeEnabled={true}
          placeholder={{
            number: '4242 4242 4242 4242',
            expiration: 'MM/YY',
            cvc: 'CVC',
            postalCode: 'ZIP',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
            fontSize: 16,
            placeholderColor: '#999999',
            borderColor: cardValid ? '#008B8B' : '#CCCCCC',
            borderWidth: 1,
            borderRadius: 8,
            padding: 16,
          }}
          dangerouslyGetFullCardDetails={true}
          onCardChange={handleCardChange}
          disabled={disabled}
        />
      </View>
      {cardValid && (
        <Text
          fontSize="$3"
          color="#008B8B"
          fontWeight="500"
        >
          Card is valid
        </Text>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    height: 50,
    justifyContent: 'center',
  },
});
