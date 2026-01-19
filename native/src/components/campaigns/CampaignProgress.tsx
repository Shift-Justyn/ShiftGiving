import { View } from 'react-native';
import { MotiView } from 'moti';
import { colors } from '../../theme/tokens';

interface CampaignProgressProps {
  raised: number;
  goal: number;
}

const calculatePercentage = (raised: number, goal: number): number => {
  if (goal <= 0) return 0;
  return Math.min((raised / goal) * 100, 100);
};

export const CampaignProgress = ({ raised, goal }: CampaignProgressProps) => {
  const percentage = calculatePercentage(raised, goal);

  return (
    <View
      testID="progress-bar"
      style={{ height: 8, backgroundColor: colors.lightBorder, borderRadius: 4, overflow: 'hidden' }}
    >
      <MotiView
        testID="progress-fill"
        from={{ width: '0%' }}
        animate={{ width: `${percentage}%` }}
        transition={{
          type: 'spring',
          damping: 12,
          mass: 1,
          overshootClamping: false,
          restSpeedThreshold: 2,
          restDisplacementThreshold: 0.1,
          duration: 800,
        }}
        style={{ height: '100%', backgroundColor: colors.primary, borderRadius: 4 }}
      />
    </View>
  );
};
