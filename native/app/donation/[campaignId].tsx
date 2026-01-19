import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useOneCampaign } from '@/src/hooks/useOneCampaign';
import { Button } from '@/src/components/ui/Button';
import { colors, spacing, radii } from '@/src/theme/tokens';
import { calculateTransactionFee, calculateTotal, formatCurrency } from '@/src/lib/fees';

const PRESET_AMOUNTS = [25, 50, 100, 200];

export default function DonationAmountScreen() {
  const router = useRouter();
  const { campaignId } = useLocalSearchParams();
  const { data: campaign } = useOneCampaign(campaignId as string);
  const [amount, setAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [coverFees, setCoverFees] = useState(false);

  const handlePresetSelect = (preset: number) => {
    setSelectedPreset(preset);
    setAmount(String(preset));
  };

  const handleCustomAmount = (value: string) => {
    setSelectedPreset(null);
    setAmount(value);
  };

  const handleContinue = () => {
    const numAmount = Number(amount);
    if (numAmount < 5 || numAmount > 10000) return;

    router.push({
      pathname: '/donation/payment',
      params: {
        campaignId: campaignId as string,
        amount: numAmount,
        coverFees: coverFees ? '1' : '0',
        organizationId: campaign?.organization?.id || '',
      },
    });
  };

  const isValidAmount = () => {
    const num = Number(amount);
    return num >= 5 && num <= 10000;
  };

  const total = calculateTotal(Number(amount) || 0, coverFees);
  const fee = calculateTransactionFee(Number(amount) || 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header onBack={() => router.back()} />

        {campaign && (
          <View style={styles.campaignInfo}>
            <Text fontSize={20} fontWeight="700" color={colors.lightText}>
              {campaign.title}
            </Text>
            <Text fontSize={14} color={colors.lightTextSecondary}>
              {campaign.organization?.name}
            </Text>
          </View>
        )}

        <View style={styles.content}>
          <Text fontSize={18} fontWeight="600" color={colors.lightText} marginBottom={spacing.md}>
            Select Amount
          </Text>

          <View style={styles.presetGrid}>
            {PRESET_AMOUNTS.map((preset) => (
              <PresetButton
                key={preset}
                amount={preset}
                selected={selectedPreset === preset}
                onPress={() => handlePresetSelect(preset)}
              />
            ))}
          </View>

          <View style={styles.customSection}>
            <Text
              fontSize={14}
              fontWeight="500"
              color={colors.lightTextSecondary}
              marginBottom={spacing.sm}>
              Or enter custom amount
            </Text>
            <View style={styles.inputWrapper}>
              <Text fontSize={20} fontWeight="600" color={colors.lightTextSecondary}>
                $
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={handleCustomAmount}
                testID="custom-amount-input"
              />
            </View>
            {amount && !isValidAmount() && (
              <Text fontSize={12} color={colors.error} marginTop={spacing.xs}>
                Amount must be between $5 and $10,000
              </Text>
            )}
          </View>

          <View style={styles.feeSection}>
            <View style={styles.feeRow}>
              <View style={styles.feeInfo}>
                <Text fontSize={14} fontWeight="600" color={colors.lightText}>
                  Cover Transaction Fees
                </Text>
                <Text fontSize={12} color={colors.lightTextSecondary}>
                  Add {formatCurrency(fee)} to help cover processing costs
                </Text>
              </View>
              <Switch
                value={coverFees}
                onValueChange={setCoverFees}
                trackColor={{ false: colors.lightBorder, true: colors.primaryLight }}
                thumbColor={coverFees ? colors.primary : colors.lightBackground}
                testID="cover-fees-switch"
              />
            </View>
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text fontSize={14} color={colors.lightTextSecondary}>
                Donation Amount
              </Text>
              <Text fontSize={14} fontWeight="600" color={colors.lightText}>
                {formatCurrency(Number(amount) || 0)}
              </Text>
            </View>
            {coverFees && (
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
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleContinue}
          disabled={!isValidAmount()}
          testID="continue-button">
          Continue to Payment
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
      Make a Donation
    </Text>
    <View style={{ width: 24 }} />
  </View>
);

const PresetButton = ({
  amount,
  selected,
  onPress,
}: {
  amount: number;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.presetButton, selected && styles.presetButtonSelected]}
    onPress={onPress}
    testID={`preset-${amount}`}>
    <Text
      fontSize={18}
      fontWeight="700"
      color={selected ? colors.primary : colors.lightText}>
      ${amount}
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
  },
  campaignInfo: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
  },
  content: {
    padding: spacing.lg,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  presetButton: {
    width: '47%',
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.lightBorder,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  customSection: {
    marginBottom: spacing.xl,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.lightBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.lightText,
    marginLeft: spacing.xs,
  },
  feeSection: {
    backgroundColor: 'white',
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feeInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  summary: {
    backgroundColor: 'white',
    borderRadius: radii.md,
    padding: spacing.lg,
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
  footer: {
    padding: spacing.lg,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.lightBorder,
  },
});
