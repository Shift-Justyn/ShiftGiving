import { View, Image, StyleSheet, Pressable } from 'react-native';
import { Text } from 'tamagui';
import { MotiView } from 'moti';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Organization } from '../../api/types';
import { colors, radii, shadows } from '../../theme/tokens';

interface OrganizationCardProps {
  organization: Organization;
  onPress: (organization: Organization) => void;
  index?: number;
}

const formatCampaignCount = (count: number): string => {
  return count === 1 ? '1 campaign' : `${count} campaigns`;
};

export const OrganizationCard = ({ organization, onPress, index = 0 }: OrganizationCardProps) => {
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
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 500,
        delay: index * 100,
      }}
    >
      <Pressable
        testID="organization-card"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(organization)}
        style={[cardAnimatedStyle, styles.card]}
      >
        <Image source={{ uri: organization.logoUrl || undefined }} style={styles.image} />
        <View style={styles.content}>
          <Text fontSize={14} fontWeight="600" color={colors.lightText} numberOfLines={1}>
            {organization.name}
          </Text>
          <Text fontSize={12} color={colors.lightTextSecondary}>
            {formatCampaignCount(organization.campaignCount)}
          </Text>
        </View>
      </Pressable>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: 'white',
    borderRadius: radii.lg,
    ...shadows.sm,
    marginRight: 12,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 100, backgroundColor: colors.lightBorder },
  content: { padding: 10, gap: 4 },
});
