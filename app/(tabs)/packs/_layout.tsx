import { Link, Stack } from 'expo-router';
import { Icon } from '@roninoss/icons';
import { Pressable } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';

export default function PacksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Packs',
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
        }}
      />
    </Stack>
  );
}
