import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/tokens';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton = ({
  width = '100%',
  height = 16,
  borderRadius = 4,
  style,
}: SkeletonProps) => {
  return (
    <MotiView
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{
        type: 'timing',
        duration: 800,
        loop: true,
      }}
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[
          colors.lightBorder,
          colors.lightSurface,
          colors.lightBorder,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </MotiView>
  );
};

export const SkeletonCard = ({ fullWidth = false }: { fullWidth?: boolean }) => {
  const width = fullWidth ? '100%' : 260;

  return (
    <View
      style={{
        width,
        backgroundColor: colors.lightSurface,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: fullWidth ? 0 : 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Skeleton width="100%" height={140} borderRadius={0} />
      <View style={{ padding: 12, gap: 8 }}>
        <Skeleton width="80%" height={16} />
        <Skeleton width="100%" height={8} />
        <Skeleton width="50%" height={14} />
        <Skeleton width="100%" height={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.lightBorder,
    overflow: 'hidden',
  },
});
