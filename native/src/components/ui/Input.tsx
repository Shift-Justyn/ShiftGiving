import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Input as TamaguiInput, InputProps as TamaguiInputProps, YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/tokens';

interface InputProps extends TamaguiInputProps {
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
}

const getInputBorderColor = (error?: string, focused?: boolean) => {
  if (error) return colors.error;
  if (focused) return colors.primary;
  return colors.lightBorder;
};

export const Input = ({ label, error, secureTextEntry, ...props }: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <YStack gap="$2">
      {label && (
        <Text fontSize={14} fontWeight="500" color={colors.lightText}>
          {label}
        </Text>
      )}
      <YStack position="relative">
        <TamaguiInput
          {...props}
          testID="input"
          accessibilityLabel={label}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          borderColor={getInputBorderColor(error, focused)}
          borderWidth={1}
          borderRadius={8}
          height={44}
          paddingHorizontal={16}
          paddingRight={secureTextEntry ? 48 : 16}
          backgroundColor="white"
        />
        {secureTextEntry && (
          <TouchableOpacity
            testID="password-toggle"
            onPress={togglePasswordVisibility}
            style={{ position: 'absolute', right: 12, top: 10 }}
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={colors.lightTextSecondary} />
          </TouchableOpacity>
        )}
      </YStack>
      {error && (
        <Text fontSize={12} color={colors.error}>
          {error}
        </Text>
      )}
    </YStack>
  );
};
