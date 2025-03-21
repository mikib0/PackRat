import { Stack } from 'expo-router';
import { ThemeToggle } from '~/components/ThemeToggle';

export default function DemoLayout() {
  return (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="index" options={{ title: 'Demo', headerRight: () => <ThemeToggle /> }} />
    </Stack>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios_from_right', // for android
} as const;
