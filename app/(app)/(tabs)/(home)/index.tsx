import { Icon } from '@roninoss/icons';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import {
  ESTIMATED_ITEM_HEIGHT,
  List,
  type ListRenderItemInfo,
  ListSectionHeader,
} from '~/components/nativewindui/List';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { WeatherTile } from '~/features/weather/components/WeatherTile';
import { CurrentPackTile } from '~/features/packs/components/CurrentPackTile';
import { RecentPacksTile } from '~/features/packs/components/RecentPacksTile';
import { AIChatTile } from '~/features/ai/components/AIChatTile';
import { PackStatsTile } from '~/features/packs/components/PackStatsTile';
import { WeightAnalysisTile } from '~/features/packs/components/WeightAnalysisTile';
import { PackCategoriesTile } from '~/features/packs/components/PackCategoriesTile';
import { UpcomingTripsTile } from '~/features/trips/components/UpcomingTripsTile';
import { TrailConditionsTile } from '~/features/trips/components/TrailConditionsTile';
import { WeatherAlertsTile } from '~/features/weather/components/WeatherAlertsTile';
import { GearInventoryTile } from '~/features/packs/components/GearInventoryTile';
import { SharedPacksTile } from '~/features/packs/components/SharedPacksTile';
import { PackTemplatesTile } from '~/features/pack-templates/components/PackTemplatesTile';
import { ShoppingListTile } from '~/features/packs/components/ShoppingListTile';
import { featureFlags } from '~/config';

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
  const dashboardLayout = [
    { id: 'current-pack', component: CurrentPackTile },
    { id: 'recent-packs', component: RecentPacksTile },
    'gap 1',
    { id: 'ask-packrat-ai', component: AIChatTile },
    'gap 1.5',
    { id: 'pack-stats', component: PackStatsTile },
    { id: 'weight-analysis', component: WeightAnalysisTile },
    { id: 'pack-categories', component: PackCategoriesTile },
    ...(featureFlags.enableTrips
      ? [
          'gap 2',
          { id: 'upcoming-trips', component: UpcomingTripsTile },
          { id: 'trail-conditions', component: TrailConditionsTile },
        ]
      : []),
    'gap 2.5',
    { id: 'weather', component: WeatherTile },
    ...(featureFlags.enableTrips ? [{ id: 'weather-alerts', component: WeatherAlertsTile }] : []),
    'gap 3',
    { id: 'gear-inventory', component: GearInventoryTile },
    ...(featureFlags.enableShoppingList
      ? [{ id: 'shopping-list', component: ShoppingListTile }]
      : []),
    ...(featureFlags.enableSharedPacks ? [{ id: 'shared-packs', component: SharedPacksTile }] : []),
    ...(featureFlags.enablePackTemplates
      ? [{ id: 'pack-templates', component: PackTemplatesTile }]
      : []),
  ];

  return (
    <View className="flex-1">
      <LargeTitleHeader
        title="Dashboard"
        searchBar={{ iosHideWhenScrolling: true }}
        backVisible={false}
        rightView={() => (
          <View className="flex-row items-center gap-2 pr-2">
            <DemoIcon />
            <SettingsIcon />
          </View>
        )}
      />

      <List
        contentContainerClassName="pt-4"
        contentInsetAdjustmentBehavior="automatic"
        variant="insets"
        data={dashboardLayout}
        estimatedItemSize={ESTIMATED_ITEM_HEIGHT.titleOnly}
        renderItem={renderDashboardItem}
        keyExtractor={keyExtractor}
        sectionHeaderAsGap
      />
    </View>
  );
}

function renderDashboardItem(info: ListRenderItemInfo<any>) {
  const item = info.item;

  if (typeof item === 'string') {
    return <ListSectionHeader {...info} />;
  }

  const Component = item.component;
  return <Component />;
}

function keyExtractor(item: any) {
  if (typeof item === 'string') {
    return item;
  }
  return item.id;
}
