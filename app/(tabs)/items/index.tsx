import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { ItemListScreen } from '~/screens/ItemsListScreen';

export default function ItemsListScreen() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <ItemListScreen />
    </>
  );
}
