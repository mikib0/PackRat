import { Icon } from '@roninoss/icons';
import { useEffect, useState } from 'react';
import { View, ScrollView, Image, ActivityIndicator } from 'react-native';

import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import { Text } from '~/components/nativewindui/Text';
import { usePacks } from '~/features/packs/hooks/usePacks';
import { useColorScheme } from '~/lib/useColorScheme';

function RecentPackCard({ pack }: { pack: any }) {
  const { colors } = useColorScheme();

  function getRelativeTime(dateString: string): string {
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    const units = [
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const { label, seconds } of units) {
      const val = Math.floor(diff / seconds);
      if (val >= 1) return `${val} ${label}${val > 1 ? 's' : ''} ago`;
    }

    return 'Just now';
  }

  return (
    <View className="mx-4 mb-3 overflow-hidden rounded-xl bg-card shadow-sm">
      {pack.image && (
        <Image source={{ uri: pack.image }} className="h-40 w-full bg-red-950" resizeMode="cover" />
      )}
      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text variant="heading" className="font-semibold">
              {pack.name}
            </Text>
            {pack.description && (
              <Text variant="subhead" className="text-muted-foreground">
                {pack.description}
              </Text>
            )}
          </View>
          <View className="items-end">
            <Text variant="subhead" className="font-medium">
              {pack.totalWeight} g
            </Text>
            <Text variant="footnote" className="text-muted-foreground">
              {getRelativeTime(pack.createdAt)}
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row items-center">
          <View className="mr-1">
            <Icon name="clock-outline" size={14} color={colors.grey} />
          </View>
          <Text variant="caption1" className="text-muted-foreground">
            Last used: {getRelativeTime(pack.updatedAt)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function RecentPacksScreen() {
  const { packs, isLoading, isError } = usePacks();

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !packs) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text variant="subhead" className="text-red-500">
          Failed to load packs.
        </Text>
      </View>
    );
  }

  const recentPacks = packs?.slice(0, 5) ?? [];

  return (
    <View className="flex-1" key={refreshKey}>
      <LargeTitleHeader title="Recent Packs" />
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text variant="subhead" className="mb-2 text-muted-foreground">
            Your recently used packs
          </Text>
        </View>

        <View className="pb-4">
          {recentPacks.map((pack) => (
            <RecentPackCard key={pack.id} pack={pack} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
