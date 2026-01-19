import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'tamagui';
import { MotiView } from 'moti';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { Campaign } from '../../api/types';
import { CampaignProgress } from './CampaignProgress';
import { colors, radii, shadows } from '../../theme/tokens';

interface CampaignCardProps {
  campaign: Campaign;
  onPress: (campaign: Campaign) => void;
  fullWidth?: boolean;
  index?: number;
}

const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

const isClosingSoon = (endDate: string): boolean => {
  const daysUntilEnd = (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return daysUntilEnd <= 7 && daysUntilEnd > 0;
};

export const CampaignCard = ({ campaign, onPress, fullWidth = false, index = 0 }: CampaignCardProps) => {
  const showClosingSoon = isClosingSoon(campaign.endDate);
  const cardStyle = fullWidth ? [styles.card, styles.cardFullWidth] : styles.card;

  const scale = useSharedValue(1);
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
      restSpeedThreshold: 2,
      restDisplacementThreshold: 0.1,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
      restSpeedThreshold: 2,
      restDisplacementThreshold: 0.1,
    });
  };

  return (
    <MotiView
      testID="campaign-card"
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 500,
        delay: index * 100,
      }}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(campaign)}
        style={[cardAnimatedStyle, cardStyle]}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: campaign.featuredImageUrl || undefined }} style={styles.image} />
          {showClosingSoon && (
            <View style={styles.closingSoonBadge}>
              <Text fontSize={12} fontWeight="600" color="white">Closing Soon!</Text>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <Text fontSize={16} fontWeight="600" color={colors.lightText} numberOfLines={1}>
            {campaign.title}
          </Text>
          <CampaignProgress raised={campaign.raisedAmount} goal={campaign.goalAmount} />
          <View style={styles.goalBadge}>
            <Text fontSize={14} fontWeight="600" color={colors.primary}>
              {formatCurrency(campaign.goalAmount)}
            </Text>
          </View>
          <Text fontSize={13} color={colors.lightTextSecondary} numberOfLines={2}>
            {campaign.shortDescription}
          </Text>
        </View>
      </Pressable>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: 'white',
    borderRadius: radii.lg,
    ...shadows.md,
    marginRight: 16,
  },
  cardFullWidth: {
    width: '100%',
    marginRight: 0,
  },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 140, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg },
  closingSoonBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  content: { padding: 12, gap: 8 },
  goalBadge: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
});
