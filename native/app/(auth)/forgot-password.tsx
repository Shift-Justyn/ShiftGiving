import { YStack } from 'tamagui';
import { Text } from '../../src/components/ui/Text';

export default function ForgotPasswordScreen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding={24}>
      <Text variant="heading">Forgot Password</Text>
      <Text>Password reset functionality coming soon</Text>
    </YStack>
  );
}
