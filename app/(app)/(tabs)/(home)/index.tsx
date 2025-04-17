import { Icon, type MaterialIconName } from '@roninoss/icons';
import { Link, RelativePathString, router } from 'expo-router';
import type React from 'react';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/nativewindui/Avatar';
import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import {
  ESTIMATED_ITEM_HEIGHT,
  List,
  type ListDataItem,
  ListItem,
  type ListRenderItemInfo,
  ListSectionHeader,
} from '~/components/nativewindui/List';
import { Text } from '~/components/nativewindui/Text';
import { useAuthState } from '~/features/auth/hooks/useAuthState';
import { useDashboardData } from '~/features/packs/hooks/useDashboardData';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { Pack } from '~/types';
import { WeatherWidget } from '~/features/locations/components';
import { DashboardSkeleton } from '~/components/SkeletonPlaceholder';

function SettingsIcon() {
  const { colors } = useColorScheme();
  return (
    <Link href="/modal" asChild>
      <Pressable className="opacity-80">
        {({ pressed }) => (
          <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
            <Icon name="cog-outline" color={colors.foreground} />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

function DemoIcon() {
  const { colors } = useColorScheme();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Link href="/demo" asChild>
      <Pressable className="opacity-80">
        {({ pressed }) => (
          <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
            <Icon name="tag-outline" color={colors.foreground} />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

export default function DashboardScreen() {
  const { data, isLoading } = useDashboardData();
  const { user } = useAuthState();
  useEffect(() => {
    console.log('user', user);
  }, [user]);
  return (
    <>
      <LargeTitleHeader
        title="Dashboard"
        searchBar={{ iosHideWhenScrolling: true }}
        rightView={() => (
          <View className="flex-row items-center gap-2 pr-2">
            <DemoIcon />
            <SettingsIcon />
          </View>
        )}
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : data ? (
        <List
          contentContainerClassName="pt-4"
          contentInsetAdjustmentBehavior="automatic"
          variant="insets"
          ListHeaderComponent={<WeatherWidget />}
          data={transformDashboardData(data)}
          estimatedItemSize={ESTIMATED_ITEM_HEIGHT.titleOnly}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          sectionHeaderAsGap
        />
      ) : null}
    </>
  );
}

function renderItem<T extends ReturnType<typeof transformDashboardData>[number]>(
  info: ListRenderItemInfo<T>
) {
  if (typeof info.item === 'string') {
    return <ListSectionHeader {...info} />;
  }

  const item = info.item as DashboardDataItem;

  const handlePress = () => {
    if (item.id === '13') {
      router.push({
        pathname: '/ai-chat-better-ui',
        params: {
          contextType: 'general',
        },
      });
    } else if (item.route) {
      router.push(item.route as RelativePathString);
    } else {
      console.log('onPress');
    }
  };

  return (
    <ListItem
      className={cn(
        'ios:pl-0 pl-2',
        info.index === 0 && 'ios:border-t-0 border-border/25 dark:border-border/80 border-t'
      )}
      titleClassName="text-lg"
      leftView={item.leftView}
      rightView={
        <View className="flex-1 flex-row items-center justify-center gap-2 px-4">
          {item.rightText && (
            <Text variant="callout" className="ios:px-0 px-2 text-muted-foreground">
              {item.rightText}
            </Text>
          )}
          {item.badge && (
            <View className="h-5 w-5 items-center justify-center rounded-full bg-primary">
              <Text variant="footnote" className="font-bold leading-4 text-primary-foreground">
                {item.badge}
              </Text>
            </View>
          )}
          <ChevronRight />
        </View>
      }
      item={{
        title: item.title,
        subTitle: item.subTitle,
      }}
      onPress={handlePress}
      target="Cell"
      index={0}
    />
  );
}

function ChevronRight() {
  const { colors } = useColorScheme();
  return <Icon name="chevron-right" size={17} color={colors.grey} />;
}

function IconView({ className, name }: { className?: string; name: MaterialIconName }) {
  return (
    <View className="px-3">
      <View className={cn('h-6 w-6 items-center justify-center rounded-md', className)}>
        <Icon name={name} size={15} color="white" />
      </View>
    </View>
  );
}

function keyExtractor(
  item: (Omit<ListDataItem, string> & { id: string; route?: string }) | string
) {
  return typeof item === 'string' ? item : item.id;
}

type DashboardDataItem = {
  id: string;
  title: string;
  subTitle?: string;
  leftView?: React.ReactNode;
  rightText?: string;
  badge?: number;
  route?: string;
};

type DashboardData = DashboardDataItem | string;

function transformDashboardData(data: any): DashboardData[] {
  const {
    currentPack,
    recentPacks,
    packWeight,
    packCategoryCount,
    upcomingTripCount,
    weatherAlertCount,
    gearInventryCount,
    shoppingList,
    packTemplateCount,
  } = data;

  const fallbackImage =
    'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop';

  const output: DashboardData[] = [];

  if (currentPack) {
    const avatarImage = currentPack.image || fallbackImage;
    output.push({
      id: '1',
      title: 'Current Pack',
      subTitle: currentPack.name,
      leftView: (
        <View className="px-3">
          <Avatar alt="Current pack avatar">
            <AvatarImage source={{ uri: avatarImage }} />
            <AvatarFallback>
              <Text>{currentPack.name.slice(0, 2).toUpperCase()}</Text>
            </AvatarFallback>
          </Avatar>
        </View>
      ),
      rightText: `${currentPack.totalWeight} g`,
      route: `/current-pack/${currentPack.id}`,
    });
  }

  if (recentPacks) {
    output.push({
      id: '2',
      title: 'Recent Packs',
      leftView: (
        <View className="flex-row px-3">
          {recentPacks.slice(0, 2).map((pack: Pack, index: number) => {
            const img = pack.image || fallbackImage;
            return (
              <Avatar
                key={index}
                alt={`${pack.name} avatar`}
                className={cn('h-6 w-6', index > 0 && '-ml-2')}>
                <AvatarImage source={{ uri: img }} />
                <AvatarFallback>
                  <Text>{pack.name.slice(0, 2).toUpperCase()}</Text>
                </AvatarFallback>
              </Avatar>
            );
          })}
        </View>
      ),
      badge: recentPacks.length,
      route: '/recent-packs',
    });
  }

  output.push('gap 1');

  output.push({
    id: '13',
    title: 'Ask PackRat AI',
    leftView: <IconView name="message" className="bg-purple-500" />,
    rightText: 'Anything outdoors...',
  });

  output.push('gap 1.5');

  output.push({
    id: '3',
    title: 'Pack Stats',
    leftView: <IconView name="chart-pie" className="bg-blue-500" />,
    route: '/pack-stats',
  });

  if (packWeight) {
    output.push({
      id: '4',
      title: 'Weight Analysis',
      leftView: <IconView name="ruler" className="bg-blue-600" />,
      rightText: `Base: ${packWeight} g`,
      route: '/weight-analysis',
    });
  }

  if (packCategoryCount) {
    output.push({
      id: '5',
      title: 'Pack Categories',
      leftView: <IconView name="puzzle" className="bg-green-500" />,
      badge: packCategoryCount,
      route: '/pack-categories',
    });
  }

  output.push('gap 2');

  if (upcomingTripCount) {
    output.push({
      id: '6',
      title: 'Upcoming Trips',
      leftView: <IconView name="map" className="bg-red-500" />,
      badge: upcomingTripCount,
      route: '/upcoming-trips',
    });
  }

  if (weatherAlertCount) {
    output.push({
      id: '7',
      title: 'Weather Alerts',
      leftView: <IconView name="weather-rainy" className="bg-amber-500" />,
      rightText: `${weatherAlertCount} active`,
      route: '/weather-alerts',
    });
  }

  output.push({
    id: '8',
    title: 'Trail Conditions',
    leftView: <IconView name="soccer-field" className="bg-violet-500" />,
    route: '/trail-conditions',
  });

  output.push('gap 3');

  if (gearInventryCount) {
    output.push({
      id: '9',
      title: 'Gear Inventory',
      leftView: <IconView name="backpack" className="bg-gray-500" />,
      rightText: `${gearInventryCount} items`,
      route: '/gear-inventory',
    });
  }

  if (shoppingList) {
    output.push({
      id: '10',
      title: 'Shopping List',
      leftView: <IconView name="cart-outline" className="bg-gray-600" />,
      badge: shoppingList,
      route: '/shopping-list',
    });
  }

  output.push({
    id: '11',
    title: 'Shared Packs',
    leftView: <IconView name="account-multiple" className="bg-sky-500" />,
    route: '/shared-packs',
  });

  if (packTemplateCount) {
    output.push({
      id: '12',
      title: 'Pack Templates',
      leftView: <IconView name="file-document-multiple" className="bg-sky-400" />,
      rightText: `${packTemplateCount} templates`,
      route: '/pack-templates',
    });
  }

  return output;
}
