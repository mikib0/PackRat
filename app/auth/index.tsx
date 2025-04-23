import { Link, Route } from 'expo-router';
import * as React from 'react';
import { Image, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AlertAnchor } from '~/components/nativewindui/Alert';
import type { AlertRef } from '~/components/nativewindui/Alert/types';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import { useAuthActions } from '~/features/auth/hooks/useAuthActions';
import { Icon } from '@roninoss/icons';
import { useLocalSearchParams } from 'expo-router';

const LOGO_SOURCE = require('~/assets/packrat-app-icon-gradient.png');

const GOOGLE_SOURCE = {
  uri: 'https://www.pngall.com/wp-content/uploads/13/Google-Logo.png',
};

type RouteParams = { returnTo: Route; signInCopy: string; showSkipLoginBtn?: string };

export default function AuthIndexScreen() {
  const { signInWithGoogle, signInWithApple } = useAuthActions();
  const alertRef = React.useRef<AlertRef>(null);
  const { returnTo, signInCopy, showSkipLoginBtn } = useLocalSearchParams<RouteParams>();

  const handleSkipLogin = async () => {
    await AsyncStorage.setItem('skipped_login', 'true');
    router.replace('/');
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="ios:justify-end flex-1 justify-center gap-4 px-8 py-4">
          <View className="items-center">
            <Image
              source={LOGO_SOURCE}
              className="ios:h-12 ios:w-12 h-8 w-8 rounded-md"
              resizeMode="contain"
            />
          </View>
          <View className="ios:pb-5 ios:pt-2 pb-2">
            <Text className="ios:font-extrabold text-center text-3xl font-medium">
              Brace Yourself
            </Text>
            <Text className="ios:font-extrabold text-center text-3xl font-medium">
              for What's Next
            </Text>
            {signInCopy && (
              <Text className="pt-4 text-center text-muted-foreground">{signInCopy}</Text>
            )}
          </View>
          <Link href={{ pathname: '/auth/(create-account)', params: { returnTo } }} asChild>
            <Button size={Platform.select({ ios: 'lg', default: 'md' })}>
              <Text>Sign up free</Text>
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="ios:border-foreground/60"
            size={Platform.select({ ios: 'lg', default: 'md' })}
            onPress={() => signInWithGoogle(returnTo)}>
            <Image
              source={GOOGLE_SOURCE}
              className="absolute left-4 h-4 w-4"
              resizeMode="contain"
            />
            <Text className="ios:text-foreground">Continue with Google</Text>
          </Button>
          {Platform.OS === 'ios' && (
            <Button
              variant="secondary"
              className="ios:border-foreground/60"
              size={Platform.select({ ios: 'lg', default: 'md' })}
              onPress={() => signInWithApple(returnTo)}>
              <Text className="ios:text-foreground absolute left-4 text-[22px]"></Text>
              <Text className="ios:text-foreground">Continue with Apple</Text>
            </Button>
          )}
          <Link href={{ pathname: '/auth/(login)', params: { returnTo } }} asChild>
            <Button variant="tonal" size={Platform.select({ ios: 'lg', default: 'md' })}>
              <Text className="text-primary">Log in</Text>
            </Button>
          </Link>

          {showSkipLoginBtn === 'true' && (
            <Button
              variant="plain"
              size={Platform.select({ ios: 'lg', default: 'md' })}
              onPress={handleSkipLogin}
              className="mt-2">
              <Icon name="arrow-right" className="mr-2" />
              <Text>Skip login</Text>
            </Button>
          )}
        </View>
      </SafeAreaView>
      <AlertAnchor ref={alertRef} />
    </>
  );
}
