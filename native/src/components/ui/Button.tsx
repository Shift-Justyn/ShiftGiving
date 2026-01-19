import { View } from 'react-native';
import { Button as TamaguiButton, ButtonProps as TamaguiButtonProps, styled } from 'tamagui';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MotiView } from 'moti';
import { colors } from '../../theme/tokens';

interface ButtonProps extends TamaguiButtonProps {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const buttonVariantStyles = {
  primary: {
    backgroundColor: colors.primary,
    color: 'white',
    borderColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    color: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.primary,
  },
};

const buttonSizeStyles = {
  sm: { height: 36, paddingHorizontal: 16, fontSize: 14 },
  md: { height: 44, paddingHorizontal: 20, fontSize: 16 },
  lg: { height: 52, paddingHorizontal: 24, fontSize: 18 },
};

const getVariantStyles = (variant: ButtonProps['variant'] = 'primary') => {
  return buttonVariantStyles[variant];
};

const getSizeStyles = (size: ButtonProps['size'] = 'md') => {
  return buttonSizeStyles[size];
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) => {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const isDisabled = disabled || loading;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
      restSpeedThreshold: 2,
      restDisplacementThreshold: 0.1,
    });
    onPressIn?.();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
      restSpeedThreshold: 2,
      restDisplacementThreshold: 0.1,
    });
    onPressOut?.();
  };

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 300 }}
      style={animatedStyle}
    >
      <TamaguiButton
        {...props}
        disabled={isDisabled}
        opacity={isDisabled ? 0.5 : 1}
        {...variantStyles}
        {...sizeStyles}
        borderRadius={8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {loading ? (
          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{
              type: 'timing',
              duration: 1000,
              loop: true,
            }}
          >
            <View style={{ width: 20, height: 20 }}>
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: variant === 'primary' ? 'white' : colors.primary,
                  borderTopColor: 'transparent',
                }}
              />
            </View>
          </MotiView>
        ) : (
          children
        )}
      </TamaguiButton>
    </MotiView>
  );
};
