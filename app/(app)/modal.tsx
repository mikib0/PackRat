import { StatusBar } from 'expo-status-bar';
import { Image, Platform, View } from 'react-native';

import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

const LOGO_SOURCE = require('~/assets/packrat-app-icon-gradient.png');

export default function ModalScreen() {
  const { colorScheme } = useColorScheme();
  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <View className="flex-1 items-center justify-center gap-1 px-12">
        <Image source={LOGO_SOURCE} className="h-10 w-10 rounded-md" resizeMode="contain" />
        <Text variant="title3" className="pb-1 text-center font-semibold">
          PackRat
        </Text>
      </View>
    </>
  );
}
