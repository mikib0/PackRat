import { Icon } from '@roninoss/icons';
import { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';

import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';

// Mock data for gear inventory
const GEAR_INVENTORY = [
  {
    id: '1',
    name: 'Big Agnes Copper Spur HV UL2',
    category: 'Shelter',
    weight: '2.2 lbs',
    purchaseDate: 'March 2023',
    condition: 'Excellent',
    notes: 'Ultralight 2-person tent, freestanding',
    inCurrentPack: true,
  },
  {
    id: '2',
    name: 'Enlightened Equipment Revelation 20°',
    category: 'Sleep System',
    weight: '1.2 lbs',
    purchaseDate: 'January 2023',
    condition: 'Excellent',
    notes: 'Down quilt, 850 fill power',
    inCurrentPack: true,
  },
  {
    id: '3',
    name: 'Therm-a-Rest NeoAir XLite',
    category: 'Sleep System',
    weight: '0.8 lbs',
    purchaseDate: 'January 2023',
    condition: 'Good',
    notes: 'Inflatable sleeping pad, R-value: 4.2',
    inCurrentPack: true,
  },
  {
    id: '4',
    name: 'MSR PocketRocket 2',
    category: 'Cooking',
    weight: '0.3 lbs',
    purchaseDate: 'February 2023',
    condition: 'Excellent',
    notes: 'Canister stove, fast boil time',
    inCurrentPack: true,
  },
  {
    id: '5',
    name: 'TOAKS Titanium 750ml Pot',
    category: 'Cooking',
    weight: '0.4 lbs',
    purchaseDate: 'February 2023',
    condition: 'Good',
    notes: 'Lightweight pot with lid',
    inCurrentPack: true,
  },
  {
    id: '6',
    name: 'Sawyer Squeeze Water Filter',
    category: 'Water',
    weight: '0.2 lbs',
    purchaseDate: 'March 2023',
    condition: 'Good',
    notes: 'Inline filter with bags',
    inCurrentPack: true,
  },
  {
    id: '7',
    name: 'Smartwater Bottles (2)',
    category: 'Water',
    weight: '0.4 lbs',
    purchaseDate: 'April 2023',
    condition: 'Fair',
    notes: '1L bottles, compatible with Sawyer',
    inCurrentPack: true,
  },
  {
    id: '8',
    name: 'Patagonia Nano Puff Jacket',
    category: 'Clothing',
    weight: '0.5 lbs',
    purchaseDate: 'November 2022',
    condition: 'Good',
    notes: 'Synthetic insulation, packable',
    inCurrentPack: true,
  },
  {
    id: '9',
    name: 'Outdoor Research Helium Rain Jacket',
    category: 'Clothing',
    weight: '0.4 lbs',
    purchaseDate: 'December 2022',
    condition: 'Excellent',
    notes: 'Waterproof/breathable, packable',
    inCurrentPack: true,
  },
  {
    id: '10',
    name: 'Anker PowerCore 10000',
    category: 'Electronics',
    weight: '0.3 lbs',
    purchaseDate: 'January 2023',
    condition: 'Excellent',
    notes: '10,000 mAh battery bank',
    inCurrentPack: true,
  },
  {
    id: '11',
    name: 'Black Diamond Spot 350 Headlamp',
    category: 'Electronics',
    weight: '0.1 lbs',
    purchaseDate: 'January 2023',
    condition: 'Excellent',
    notes: '350 lumens, rechargeable',
    inCurrentPack: true,
  },
  {
    id: '12',
    name: 'Adventure Medical Kits Ultralight',
    category: 'First Aid',
    weight: '0.2 lbs',
    purchaseDate: 'March 2023',
    condition: 'Excellent',
    notes: 'Basic first aid supplies',
    inCurrentPack: true,
  },
];

// Group gear by category
const GEAR_BY_CATEGORY = GEAR_INVENTORY.reduce(
  (acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  },
  {} as Record<string, typeof GEAR_INVENTORY>
);

function ConditionBadge({ condition }: { condition: string }) {
  const getColor = () => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-500';
      case 'Good':
        return 'bg-blue-500';
      case 'Fair':
        return 'bg-amber-500';
      case 'Poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <View className={cn('rounded-full px-2 py-1', getColor())}>
      <Text variant="caption2" className="font-medium text-white">
        {condition}
      </Text>
    </View>
  );
}

function GearItemCard({ item }: { item: (typeof GEAR_INVENTORY)[0] }) {
  const { colors } = useColorScheme();

  return (
    <View className="mx-4 mb-3 overflow-hidden rounded-xl bg-card shadow-sm">
      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text variant="heading" className="font-semibold">
              {item.name}
            </Text>
            <Text variant="subhead" className="text-muted-foreground">
              {item.category} • {item.weight}
            </Text>
          </View>
          <ConditionBadge condition={item.condition} />
        </View>

        <View className="mt-3 flex-row flex-wrap">
          <View className="mr-4 flex-row items-center">
            <View className="mr-1">
              <Icon name="calendar-month" size={14} color={colors.grey} />
            </View>
            <Text variant="footnote" className="text-muted-foreground">
              Purchased: {item.purchaseDate}
            </Text>
          </View>
          {item.inCurrentPack && (
            <View className="flex-row items-center">
              <View className="mr-1">
                <Icon name="check-circle" size={14} color={colors.green} />
              </View>
              <Text variant="footnote" className="text-green-500">
                In current pack
              </Text>
            </View>
          )}
        </View>

        {item.notes && (
          <View className="mt-3 rounded-md bg-muted p-3 dark:bg-gray-50/10">
            <Text variant="footnote">{item.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function CategorySection({ category, items }: { category: string; items: typeof GEAR_INVENTORY }) {
  return (
    <View className="mb-4">
      <View className="bg-primary/10 px-4 py-2">
        <Text variant="subhead" className="font-semibold">
          {category} ({items.length})
        </Text>
      </View>
      <View className="mt-3">
        {items.map((item) => (
          <GearItemCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

export default function GearInventoryScreen() {
  const [viewMode, setViewMode] = useState<'all' | 'category'>('all');

  return (
    <>
      <LargeTitleHeader title="Gear Inventory" />
      <ScrollView className="flex-1">
        <View className="flex-row items-center justify-between p-4">
          <Text variant="subhead" className="text-muted-foreground">
            42 items in your inventory
          </Text>
          <View className="flex-row overflow-hidden rounded-lg bg-card">
            <Pressable
              className={cn('px-3 py-1.5', viewMode === 'all' ? 'bg-primary' : 'bg-transparent')}
              onPress={() => setViewMode('all')}>
              <Text
                variant="subhead"
                className={
                  viewMode === 'all' ? 'text-primary-foreground' : 'text-muted-foreground'
                }>
                All
              </Text>
            </Pressable>
            <Pressable
              className={cn(
                'px-3 py-1.5',
                viewMode === 'category' ? 'bg-primary' : 'bg-transparent'
              )}
              onPress={() => setViewMode('category')}>
              <Text
                variant="subhead"
                className={
                  viewMode === 'category' ? 'text-primary-foreground' : 'text-muted-foreground'
                }>
                By Category
              </Text>
            </Pressable>
          </View>
        </View>

        {viewMode === 'all' ? (
          <View className="pb-4">
            {GEAR_INVENTORY.map((item) => (
              <GearItemCard key={item.id} item={item} />
            ))}
          </View>
        ) : (
          <View className="pb-4">
            {Object.entries(GEAR_BY_CATEGORY).map(([category, items]) => (
              <CategorySection key={category} category={category} items={items} />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}
