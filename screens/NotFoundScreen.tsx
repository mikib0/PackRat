'use client';
import { Icon } from '@roninoss/icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';

type NotFoundScreenProps = {
  title?: string;
  message?: string;
  backButtonLabel?: string;
  onBackPress?: () => void;
};

export function NotFoundScreen({
  title = 'Not Found',
  message = "The content you're looking for doesn't exist or has been moved.",
  backButtonLabel = 'Go Back',
  onBackPress,
}: NotFoundScreenProps) {
  const router = useRouter();
  const { colors } = useColorScheme();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="items-center">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full">
          <Icon name="alert-circle" size={40} color={colors.foreground} />
        </View>

        <Text className="ios:text-black dark:ios:text-white mb-2 text-center text-2xl font-bold">
          {title}
        </Text>

        <Text className="ios:text-gray-500 dark:ios:text-gray-400 mb-8 max-w-xs text-center">
          {message}
        </Text>

        <TouchableOpacity
          onPress={handleBackPress}
          className="ios:bg-blue-500 flex-row items-center rounded-full px-5 py-3">
          <Icon name="chevron-left" size={18} color={colors.foreground} />
          <Text className="ios:text-white font-medium">{backButtonLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
