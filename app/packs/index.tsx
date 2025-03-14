import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { useAtom } from 'jotai';
import { searchValueAtom } from '~/atoms/packListAtoms';
import { useColorScheme } from '~/lib/useColorScheme';
import { useHeaderSearchBar } from '~/lib/useHeaderSearchBar';
import { PackListScreen } from '~/screens/PackListScreen';

export default function PacksScreen() {
  const { colors, colorScheme } = useColorScheme();
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);

  useHeaderSearchBar({
    hideWhenScrolling: false,
    onChangeText: (text) => setSearchValue(String(text)),
  });

  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <PackListScreen />
    </>
  );
}
