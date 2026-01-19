import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider } from 'tamagui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeProvider } from '@stripe/stripe-react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '../src/store/authStore';
import config from '../tamagui.config';

const queryClient = new QueryClient();

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadToken = useAuthStore((state) => state.loadToken);

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return (
    <StripeProvider publishableKey="pk_test_placeholder">
      <TamaguiProvider config={config} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack
              screenOptions={{
                animationEnabled: true,
                cardStyleInterpolator: ({ current, layouts }) => {
                  return {
                    cardStyle: {
                      opacity: current.progress,
                    },
                  };
                },
              }}
            >
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
                animationEnabled: true,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                animationEnabled: true,
              }}
            />
            <Stack.Screen
              name="campaigns/index"
              options={{
                headerShown: false,
                animationEnabled: true,
              }}
            />
            <Stack.Screen
              name="campaign/[id]"
              options={{
                headerShown: false,
                animationEnabled: true,
              }}
            />
            <Stack.Screen
              name="organizations/index"
              options={{
                headerShown: false,
                animationEnabled: true,
              }}
            />
            <Stack.Screen
              name="organization/[id]"
              options={{
                headerShown: false,
                animationEnabled: true,
              }}
            />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </TamaguiProvider>
    </StripeProvider>
  );
}
