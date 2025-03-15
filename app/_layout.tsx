import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Icon } from '@roninoss/icons';
import 'expo-dev-client';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, View } from 'react-native';
import '../global.css';

import { ThemeToggle } from '~/components/ThemeToggle';
import { cn } from '~/lib/cn';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { Providers } from '~/providers';
import { NAV_THEME } from '~/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      <Providers>
        <NavThemeProvider value={NAV_THEME[colorScheme]}>
          <Stack screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="(tabs)" options={TABS_OPTIONS} />
            <Stack.Screen name="index" options={INDEX_OPTIONS} />
            <Stack.Screen name="demo" options={DEMO_OPTIONS} />
            <Stack.Screen name="modal" options={MODAL_OPTIONS} />
            <Stack.Screen name="consent-modal" options={CONSENT_MODAL_OPTIONS} />
            <Stack.Screen name="packs/index" options={PACK_LIST_OPTIONS} />
            <Stack.Screen name="pack/[id]/index" options={PACK_DETAIL_OPTIONS} />
            <Stack.Screen name="pack/[id]/edit" options={PACK_EDIT_OPTIONS} />
            <Stack.Screen name="pack/new" options={PACK_NEW_OPTIONS} />
            <Stack.Screen name="items/index" options={ITEM_LIST_OPTIONS} />
            <Stack.Screen name="item/index" options={ITEM_LIST_OPTIONS} />
            <Stack.Screen name="item/[id]/index" options={ITEM_DETAIL_OPTIONS} />
            <Stack.Screen name="item/[id]/edit" options={ITEM_EDIT_OPTIONS} />
            <Stack.Screen name="item/new" options={ITEM_NEW_OPTIONS} />
          </Stack>
        </NavThemeProvider>
      </Providers>
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios_from_right', // for android
} as const;

const INDEX_OPTIONS = {
  headerLargeTitle: true,
  title: 'Dashboard',
  headerRight: () => <SettingsIcon />,
} as const;

function SettingsIcon() {
  const { colors } = useColorScheme();
  return (
    <Link href="/modal" asChild>
      <Pressable className="opacity-80">
        {({ pressed }) => (
          <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
            <Icon name="cog-outline" color={colors.foreground} />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const TABS_OPTIONS = {
  headerShown: false,
} as const;

// MODALS
const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
  title: 'Settings',
  headerRight: () => <ThemeToggle />,
} as const;

const CONSENT_MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
} as const;

const PACK_NEW_OPTIONS = {
  title: 'Create New Pack',
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
} as const;

const ITEM_NEW_OPTIONS = {
  title: 'Create New Item',
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
} as const;

// MAIN SCREENS
const DEMO_OPTIONS = {
  title: 'Demo',
  headerRight: () => <ThemeToggle />,
} as const;

const PACK_LIST_OPTIONS = {
  title: 'My Packs',
  headerLargeTitle: true,
  headerRight: () => {
    const { colors } = useColorScheme();
    return (
      <Link href="/pack/new" asChild>
        <Pressable>
          <Icon name="plus" color={colors.foreground} />
        </Pressable>
      </Link>
    );
  },
} as const;

const ITEM_LIST_OPTIONS = {
  title: 'My Items',
  headerLargeTitle: true,
} as const;

// DETAIL SCREENS
const PACK_DETAIL_OPTIONS = {
  title: 'Pack Details',
  headerRight: () => {
    const { colors } = useColorScheme();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const effectiveId = Array.isArray(id) ? id[0] : id;

    return (
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => router.push({ pathname: '/pack/[id]/edit', params: { id: effectiveId } })}>
          <Icon name="pencil-box-outline" color={colors.foreground} />
        </Pressable>
        <Pressable onPress={() => router.push('/item/new')}>
          <Icon name="plus" color={colors.foreground} />
        </Pressable>
      </View>
    );
  },
} as const;

const PACK_EDIT_OPTIONS = {
  title: 'Edit Pack',
} as const;

const ITEM_DETAIL_OPTIONS = {
  title: 'Item Details',
} as const;

const ITEM_EDIT_OPTIONS = {
  title: 'Edit Item',
} as const;
