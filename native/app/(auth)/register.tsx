import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, Link } from 'expo-router';
import { YStack, XStack, ScrollView } from 'tamagui';
import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/store/authStore';
import { registerSchema, RegisterFormData } from '../../src/lib/validation';
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

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [userType, setUserType] = useState('individual');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await register({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password });
      Alert.alert('Success', 'Account created successfully. Please log in.');
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
      <YStack gap="$4" backgroundColor="white" borderRadius={16} padding={24}>
        <Text variant="heading" textAlign="center">
          Sign Up
        </Text>

        <UserTypeToggle value={userType} onChange={setUserType} />

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <Input label="First Name" value={value} onChangeText={onChange} error={errors.firstName?.message} />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <Input label="Last Name" value={value} onChangeText={onChange} error={errors.lastName?.message} />
          )}
        />

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

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Confirm Password"
              value={value}
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
              secureTextEntry
            />
          )}
        />

        <Button testID="register-button" onPress={handleSubmit(onSubmit)} loading={loading}>
          Sign Up
        </Button>

        <XStack justifyContent="center" gap="$2">
          <Text color={colors.lightTextSecondary}>Already have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <Text color={colors.primary} fontWeight="600">
              Log In
            </Text>
          </Link>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
