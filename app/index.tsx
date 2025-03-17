import { Icon, type MaterialIconName } from '@roninoss/icons';
import { Link } from 'expo-router';
import type React from 'react';
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
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';

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
  const { colors } = useColorScheme();
  return (
    <>
      <LargeTitleHeader
        title="Dashboard"
        searchBar={{ iosHideWhenScrolling: true }}
        rightView={() => (
          <View className="flex-row gap-2 pr-2">
            <DemoIcon />
            <SettingsIcon />
          </View>
        )}
      />
      <List
        contentContainerClassName="pt-4"
        contentInsetAdjustmentBehavior="automatic"
        variant="insets"
        data={DATA}
        estimatedItemSize={ESTIMATED_ITEM_HEIGHT.titleOnly}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        sectionHeaderAsGap
      />
    </>
  );
}

function renderItem<T extends (typeof DATA)[number]>(info: ListRenderItemInfo<T>) {
  if (typeof info.item === "string") {
    return <ListSectionHeader {...info} />
  }

  const handlePress = () => {
    if (info.item.id === "13") {
      // Navigate to AI chat
      const { router } = require("expo-router")
      router.push({
        pathname: "/ai-chat-better-ui",
        params: {
          contextType: "general",
        },
      })
    } else {
      console.log("onPress")
    }
  }

  return (
    <ListItem
      className={cn(
        'ios:pl-0 pl-2',
        info.index === 0 && 'ios:border-t-0 border-border/25 dark:border-border/80 border-t'
      )}
      titleClassName="text-lg"
      leftView={info.item.leftView}
      rightView={
        <View className="flex-1 flex-row items-center justify-center gap-2 px-4">
          {info.item.rightText && (
            <Text variant="callout" className="ios:px-0 px-2 text-muted-foreground">
              {info.item.rightText}
            </Text>
          )}
          {info.item.badge && (
            <View className="h-5 w-5 items-center justify-center rounded-full bg-primary">
              <Text variant="footnote" className="font-bold leading-4 text-primary-foreground">
                {info.item.badge}
              </Text>
            </View>
          )}
          <ChevronRight />
        </View>
      }
      {...info}
      onPress={handlePress}
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

function keyExtractor(item: (Omit<ListDataItem, string> & { id: string }) | string) {
  return typeof item === 'string' ? item : item.id;
}

type MockData =
  | {
      id: string;
      title: string;
      subTitle?: string;
      leftView?: React.ReactNode;
      rightText?: string;
      badge?: number;
    }
  | string;

const DATA: MockData[] = [
  {
    id: '1',
    title: 'Current Pack',
    subTitle: 'Appalachian Trail 2024',
    leftView: (
      <View className="px-3">
        <Avatar alt="Current pack avatar">
          <AvatarImage
            source={{
              uri: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop',
            }}
          />
          <AvatarFallback>
            <Text>AT</Text>
          </AvatarFallback>
        </Avatar>
      </View>
    ),
    rightText: '12.4 lbs',
  },
  {
    id: '2',
    title: 'Recent Packs',
    leftView: (
      <View className="flex-row px-3">
        <Avatar alt="Weekend pack avatar" className="h-6 w-6">
          <AvatarImage
            source={{
              uri: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?q=80&w=400&auto=format&fit=crop',
            }}
          />
          <AvatarFallback>
            <Text>WP</Text>
          </AvatarFallback>
        </Avatar>
        <Avatar alt="Day hike pack avatar" className="-ml-2 h-6 w-6">
          <AvatarImage
            source={{
              uri: 'https://images.unsplash.com/photo-1501554728187-ce583db33af7?q=80&w=400&auto=format&fit=crop',
            }}
          />
          <AvatarFallback>
            <Text>DH</Text>
          </AvatarFallback>
        </Avatar>
      </View>
    ),
    badge: 3,
  },
  "gap 1",
  {
    id: "13",
    title: "Ask PackRat AI",
    leftView: <IconView name="message" className="bg-purple-500" />,
    rightText: "Anything outdoors...",
  },
  "gap 1.5",
  {
    id: '3',
    title: 'Pack Stats',
    leftView: <IconView name="chart-pie" className="bg-blue-500" />,
  },
  {
    id: '4',
    title: 'Weight Analysis',
    leftView: <IconView name="ruler" className="bg-blue-600" />,
    rightText: 'Base: 8.2 lbs',
  },
  {
    id: '5',
    title: 'Pack Categories',
    leftView: <IconView name="puzzle" className="bg-green-500" />,
    badge: 7,
  },
  'gap 2',
  {
    id: '6',
    title: 'Upcoming Trips',
    leftView: <IconView name="map" className="bg-red-500" />,
    badge: 2,
  },
  {
    id: '7',
    title: 'Weather Alerts',
    leftView: <IconView name="weather-rainy" className="bg-amber-500" />,
    rightText: '2 active',
  },
  {
    id: '8',
    title: 'Trail Conditions',
    leftView: <IconView name="soccer-field" className="bg-violet-500" />,
  },
  'gap 3',
  {
    id: '9',
    title: 'Gear Inventory',
    leftView: <IconView name="backpack" className="bg-gray-500" />,
    rightText: '42 items',
  },
  {
    id: '10',
    title: 'Shopping List',
    leftView: <IconView name="cart-outline" className="bg-gray-600" />,
    badge: 5,
  },
  {
    id: '11',
    title: 'Shared Packs',
    leftView: <IconView name="account-multiple" className="bg-sky-500" />,
  },
  {
    id: '12',
    title: 'Pack Templates',
    leftView: <IconView name="file-document-multiple" className="bg-sky-400" />,
    rightText: '4 templates',
  },
];
