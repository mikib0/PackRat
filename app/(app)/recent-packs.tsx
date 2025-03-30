import { Icon } from '@roninoss/icons';
import { View, ScrollView, Image } from 'react-native';
import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

// Mock data for recent packs
const RECENT_PACKS = [
  {
    id: '1',
    name: 'Weekend Pack',
    description: 'Short weekend trip to the mountains',
    date: '2 weeks ago',
    totalWeight: '9.8 lbs',
    image:
      'https://images.unsplash.com/photo-1533873984035-25970ab07461?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Day Hike',
    description: 'Day hike at local state park',
    date: '1 month ago',
    totalWeight: '5.2 lbs',
    image:
      'https://images.unsplash.com/photo-1501554728187-ce583db33af7?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Winter Camping',
    description: 'Cold weather gear setup',
    date: '3 months ago',
    totalWeight: '15.6 lbs',
    image:
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=400&auto=format&fit=crop',
  },
];

function RecentPackCard({ pack }: { pack: (typeof RECENT_PACKS)[0] }) {
  const { colors } = useColorScheme();

  return (
    <View className="mx-4 mb-3 overflow-hidden rounded-xl bg-card shadow-sm">
      <Image source={{ uri: pack.image }} className="h-40 w-full" resizeMode="cover" />
      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text variant="heading" className="font-semibold">
              {pack.name}
            </Text>
            <Text variant="subhead" className="text-muted-foreground">
              {pack.description}
            </Text>
          </View>
          <View className="items-end">
            <Text variant="subhead" className="font-medium">
              {pack.totalWeight}
            </Text>
            <Text variant="footnote" className="text-muted-foreground">
              {pack.date}
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row items-center">
          <View className="mr-1">
            <Icon name="clock-outline" size={14} color={colors.grey} />
          </View>
          <Text variant="caption1" className="text-muted-foreground">
            Last used: {pack.date}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function RecentPacksScreen() {
  return (
    <>
      <LargeTitleHeader title="Recent Packs" />
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text variant="subhead" className="mb-2 text-muted-foreground">
            Your recently used packs
          </Text>
        </View>

        <View className="pb-4">
          {RECENT_PACKS.map((pack) => (
            <RecentPackCard key={pack.id} pack={pack} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}
