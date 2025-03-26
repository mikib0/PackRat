import { useAtom } from 'jotai';
import { isAuthenticatedAtom, tokenAtom } from '../atoms/authAtoms';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import 'expo-dev-client';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { Providers } from '~/providers';
import { NAV_THEME } from '~/theme';
import { AuthProvider } from '~/features/auth/contexts/AuthContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [token] = useAtom(tokenAtom);

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      <Providers>
        <NavThemeProvider value={NAV_THEME[colorScheme]}>
          <AuthProvider>
            <Stack screenOptions={SCREEN_OPTIONS}>
              <Stack.Screen name="(app)" />
              <Stack.Screen name="auth" />
            </Stack>
          </AuthProvider>
        </NavThemeProvider>
      </Providers>
    </>
  );
}

const SCREEN_OPTIONS = {
  headerShown: false,
  animation: 'ios_from_right', // for android
} as const;
