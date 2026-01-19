import { View, ScrollView, StyleSheet, Share, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { MotiView } from 'moti';
import { Button } from '@/src/components/ui/Button';
import { colors, spacing, radii } from '@/src/theme/tokens';
import { formatCurrency } from '@/src/lib/fees';
import { getDonationById } from '@/src/api/donations';
import { Donation } from '@/src/api/types';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { donationId } = useLocalSearchParams();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonation();
  }, [donationId]);

  const loadDonation = async () => {
    try {
      setLoading(true);
      const data = await getDonationById(donationId as string);
      setDonation(data);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = async () => {
    if (!donation) return;
    try {
      await Share.share({
        message: `I just donated ${formatCurrency(donation.amount)} to help make a difference!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    console.log('Download receipt for donation:', donationId);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text fontSize={16} color={colors.lightTextSecondary}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!donation) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text fontSize={16} color={colors.error}>
            Donation not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <MotiView
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, mass: 0.8 }}
          style={styles.successIcon}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={48} color="white" />
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}>
          <Text
            fontSize={28}
            fontWeight="700"
            color={colors.lightText}
            textAlign="center"
            marginBottom={spacing.sm}>
            Thank You!
          </Text>
          <Text
            fontSize={16}
            color={colors.lightTextSecondary}
            textAlign="center"
            marginBottom={spacing.xl}>
            Your donation has been processed successfully
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 400 }}
          style={styles.amountCard}>
          <Text fontSize={14} color={colors.lightTextSecondary} textAlign="center">
            Your donation
          </Text>
          <Text fontSize={40} fontWeight="700" color={colors.primary} textAlign="center">
            {formatCurrency(donation.amount)}
          </Text>
        </MotiView>

        <View style={styles.detailsCard}>
          <DetailRow icon="calendar" label="Date" value={formatDate(donation.createdAt)} />
          <DetailRow
            icon="document-text"
            label="Confirmation ID"
            value={donation.id.substring(0, 8).toUpperCase()}
            mono
          />
          <DetailRow icon="card" label="Payment Method" value="Credit Card" />
          {donation.donorMessage && (
            <View style={styles.messageRow}>
              <Ionicons name="chatbox" size={20} color={colors.lightTextSecondary} />
              <View style={styles.messageContent}>
                <Text fontSize={12} color={colors.lightTextSecondary}>
                  Your message
                </Text>
                <Text fontSize={14} color={colors.lightText} fontStyle="italic">
                  {donation.donorMessage}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            onPress={handleDownloadReceipt}
            testID="download-receipt-button">
            Download Receipt
          </Button>
          <Button variant="secondary" size="lg" onPress={handleShare} testID="share-button">
            Share Your Impact
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onPress={() => router.push('/(tabs)/')}
            testID="back-home-button">
            Return Home
          </Button>
        </View>

        <View style={styles.thankYouNote}>
          <Ionicons name="heart" size={24} color={colors.primary} />
          <Text
            fontSize={14}
            color={colors.lightTextSecondary}
            textAlign="center"
            marginLeft={spacing.sm}>
            Your generosity makes a real difference. Thank you for being part of our community.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const DetailRow = ({
  icon,
  label,
  value,
  mono,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon} size={20} color={colors.lightTextSecondary} />
    <View style={styles.detailContent}>
      <Text fontSize={12} color={colors.lightTextSecondary}>
        {label}
      </Text>
      <Text
        fontSize={14}
        fontWeight="600"
        color={colors.lightText}
        fontFamily={mono ? 'monospace' : undefined}>
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBackground,
  },
  scrollContent: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    marginBottom: spacing.xl,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  amountCard: {
    width: '100%',
    backgroundColor: colors.primaryLight + '20',
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
    gap: spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  messageContent: {
    flex: 1,
    gap: spacing.xs,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  thankYouNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: radii.lg,
    padding: spacing.lg,
    width: '100%',
  },
});
