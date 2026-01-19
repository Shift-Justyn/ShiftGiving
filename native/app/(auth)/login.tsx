import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, Link } from 'expo-router';
import { YStack, XStack, ScrollView } from 'tamagui';
import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/store/authStore';
import { loginSchema, LoginFormData } from '../../src/lib/validation';
import { colors } from '../../src/theme/tokens';
import { Alert } from 'react-native';

const UserTypeToggle = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <XStack gap="$2" marginBottom="$4">
    <Button variant={value === 'individual' ? 'primary' : 'outline'} onPress={() => onChange('individual')} flex={1}>
      Individual
    </Button>
    <Button variant={value === 'charity' ? 'primary' : 'outline'} onPress={() => onChange('charity')} flex={1}>
      Charity
    </Button>
  </XStack>
);

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [userType, setUserType] = useState('individual');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
      <YStack gap="$4" backgroundColor="white" borderRadius={16} padding={24}>
        <Text variant="heading" textAlign="center">
          Log In
        </Text>

        <UserTypeToggle value={userType} onChange={setUserType} />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Password"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              secureTextEntry
            />
          )}
        />

        <Link href="/(auth)/forgot-password" asChild>
          <Text color={colors.primary} textAlign="right" fontSize={14}>
            Forgot Password?
          </Text>
        </Link>

        <Button testID="login-button" onPress={handleSubmit(onSubmit)} loading={loading}>
          Log In
        </Button>

        <XStack justifyContent="center" gap="$2">
          <Text color={colors.lightTextSecondary}>Don't have an account?</Text>
          <Link href="/(auth)/register" asChild>
            <Text color={colors.primary} fontWeight="600">
              Sign Up
            </Text>
          </Link>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
