import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, Image } from 'tamagui';
import { colors } from '../../src/theme/tokens';

const AuthGradient = () => {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
    />
  );
};

export default function AuthLayout() {
  return (
    <>
      <AuthGradient />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </>
  );
}
