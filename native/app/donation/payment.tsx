import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { colors, spacing, radii } from '@/src/theme/tokens';
import { formatCurrency, calculateTransactionFee, calculateTotal } from '@/src/lib/fees';
import { useDonation } from '@/src/hooks/useDonation';
import { PaymentMethod } from '@/src/api/types';
import { useAuthStore } from '@/src/store/authStore';

export default function PaymentScreen() {
  const router = useRouter();
  const { campaignId, amount, coverFees, organizationId } = useLocalSearchParams();
  const token = useAuthStore((state) => state.token);
  const { mutate, isPending } = useDonation();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Card);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [error, setError] = useState('');

  const donationAmount = Number(amount);
  const includeFees = coverFees === '1';
  const total = calculateTotal(donationAmount, includeFees);
  const fee = calculateTransactionFee(donationAmount);

  const formatCardNumberInput = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').substring(0, 19) : cleaned;
  };

  const formatExpiryInput = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumberInput(text));
  };

  const handleExpiryChange = (text: string) => {
    setExpiryDate(formatExpiryInput(text));
  };

  const handleCvvChange = (text: string) => {
    setCvv(text.replace(/\D/g, '').substring(0, 4));
  };

  const isFormValid = () => {
    if (paymentMethod !== PaymentMethod.Card) return true;
    return (
      cardNumber.replace(/\s/g, '').length >= 13 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      cardholderName.length > 0
    );
  };

  const handleSubmit = () => {
    if (!isFormValid() || !token) return;

    setError('');
    mutate(
      {
        request: {
          amount: donationAmount,
          campaignId: campaignId as string,
          organizationId: organizationId as string,
          isAnonymous: false,
          paymentMethod: paymentMethod,
        },
        token,
      },
      {
        onSuccess: (donation) => {
          router.push({
            pathname: '/donation/confirmation',
            params: { donationId: donation.id },
          });
        },
        onError: () => {
          setError('Payment failed. Please try again.');
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header onBack={() => router.back()} />

        <View style={styles.content}>
          <Text fontSize={18} fontWeight="600" color={colors.lightText} marginBottom={spacing.lg}>
            Payment Information
          </Text>

          <View style={styles.paymentMethods}>
            <PaymentMethodButton
              title="Credit/Debit Card"
              icon="card"
              selected={paymentMethod === PaymentMethod.Card}
              onPress={() => setPaymentMethod(PaymentMethod.Card)}
            />
            {Platform.OS === 'ios' && (
              <PaymentMethodButton
                title="Apple Pay"
                icon="logo-apple"
                selected={paymentMethod === PaymentMethod.ApplePay}
                onPress={() => setPaymentMethod(PaymentMethod.ApplePay)}
              />
            )}
            {Platform.OS === 'android' && (
              <PaymentMethodButton
                title="Google Pay"
                icon="logo-google"
                selected={paymentMethod === PaymentMethod.GooglePay}
                onPress={() => setPaymentMethod(PaymentMethod.GooglePay)}
              />
            )}
          </View>

          {paymentMethod === PaymentMethod.Card && (
            <View style={styles.cardForm}>
              <View style={styles.inputGroup}>
                <Text fontSize={14} fontWeight="500" color={colors.lightText}>
                  Cardholder Name
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  testID="cardholder-name-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text fontSize={14} fontWeight="500" color={colors.lightText}>
                  Card Number
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  maxLength={19}
                  testID="card-number-input"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text fontSize={14} fontWeight="500" color={colors.lightText}>
                    Expiry Date
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    value={expiryDate}
                    onChangeText={handleExpiryChange}
                    maxLength={5}
                    testID="expiry-date-input"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text fontSize={14} fontWeight="500" color={colors.lightText}>
                    CVV
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    keyboardType="numeric"
                    value={cvv}
                    onChangeText={handleCvvChange}
                    maxLength={4}
                    secureTextEntry
                    testID="cvv-input"
                  />
                </View>
              </View>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={colors.error} />
              <Text fontSize={14} color={colors.error} marginLeft={spacing.xs}>
                {error}
              </Text>
            </View>
          )}

          <View style={styles.summary}>
            <Text fontSize={16} fontWeight="600" color={colors.lightText} marginBottom={spacing.md}>
              Order Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text fontSize={14} color={colors.lightTextSecondary}>
                Donation Amount
              </Text>
              <Text fontSize={14} fontWeight="600" color={colors.lightText}>
                {formatCurrency(donationAmount)}
              </Text>
            </View>
            {includeFees && (
              <View style={styles.summaryRow}>
                <Text fontSize={14} color={colors.lightTextSecondary}>
                  Transaction Fee
                </Text>
                <Text fontSize={14} fontWeight="600" color={colors.lightText}>
                  {formatCurrency(fee)}
                </Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text fontSize={16} fontWeight="700" color={colors.lightText}>
                Total
              </Text>
              <Text fontSize={20} fontWeight="700" color={colors.primary}>
                {formatCurrency(total)}
              </Text>
            </View>
          </View>

          <View style={styles.secureNote}>
            <Ionicons name="lock-closed" size={16} color={colors.lightTextSecondary} />
            <Text fontSize={12} color={colors.lightTextSecondary} marginLeft={spacing.xs}>
              Secure, encrypted payment
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          disabled={!isFormValid() || isPending}
          testID="submit-payment-button">
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            `Donate ${formatCurrency(total)}`
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const Header = ({ onBack }: { onBack: () => void }) => (
  <View style={styles.header}>
    <TouchableOpacity testID="back-button" onPress={onBack}>
      <Ionicons name="chevron-back" size={24} color={colors.lightText} />
    </TouchableOpacity>
    <Text fontSize={16} fontWeight="600" color={colors.lightText}>
      Payment
    </Text>
    <View style={{ width: 24 }} />
  </View>
);

const PaymentMethodButton = ({
  title,
  icon,
  selected,
  onPress,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.paymentMethodButton, selected && styles.paymentMethodButtonSelected]}
    onPress={onPress}
    testID={`payment-method-${icon}`}>
    <Ionicons
      name={icon}
      size={24}
      color={selected ? colors.primary : colors.lightTextSecondary}
    />
    <Text
      fontSize={14}
      fontWeight="600"
      color={selected ? colors.primary : colors.lightText}
      marginLeft={spacing.sm}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
  },
  content: {
    padding: spacing.lg,
  },
  paymentMethods: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: 'white',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.lightBorder,
  },
  paymentMethodButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  cardForm: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.lightBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.lightText,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.error + '20',
    borderRadius: radii.md,
    marginBottom: spacing.lg,
  },
  summary: {
    backgroundColor: 'white',
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightBorder,
    marginVertical: spacing.md,
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.lightBorder,
  },
});
