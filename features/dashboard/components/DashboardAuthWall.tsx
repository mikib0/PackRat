import { Icon } from '@roninoss/icons';
import { usePathname, useRouter } from 'expo-router';
import { Image, SafeAreaView, View } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';

const LOGO_SOURCE = require('~/assets/packrat-app-icon-gradient.png');

export function DashboardAuthWall() {
  const router = useRouter();
  const currentRoute = usePathname();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        <View className="mb-8 items-center justify-center">
          <View className="bg-primary/10 mb-4 rounded-full p-6">
            <Image source={LOGO_SOURCE} className="h-12 w-12 rounded-md" resizeMode="contain" />
          </View>
          <Text variant="title1" className="text-center">
            Join PackRat to Unlock All Features
          </Text>
        </View>

        <View className="mb-10 flex-col gap-6">
          <FeatureItem
            icon="cloud-outline"
            title="Sync Across Devices"
            description="Keep your packs in sync everywhere"
          />
          <FeatureItem
            icon="weather-sunny"
            title="Weather Integration"
            description="Get weather-based recommendations"
          />
          <FeatureItem
            icon="message-outline"
            title="AI Chat & Suggestions"
            description="Smart packing assistance"
          />
          <FeatureItem
            icon="archive-outline"
            title="Share Your Packs"
            description="Share and browse public packs"
          />
        </View>

        <Button
          onPress={() => router.push({ pathname: '/auth', params: { redirectTo: currentRoute } })}
          size="lg"
          variant="primary"
          className="mb-4 w-full">
          <Text className="font-medium">Sign In</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-center">
      <View className="bg-primary/10 mr-4 h-10 w-10 items-center justify-center rounded-full">
        <Icon name={icon} size={20} color="primary" />
      </View>
      <View className="flex-1">
        <Text variant="title3" className="mb-0.5">
          {title}
        </Text>
        <Text className="text-muted-foreground">{description}</Text>
      </View>
    </View>
  );
}

