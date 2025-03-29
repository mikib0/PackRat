'use client';

import type React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/nativewindui/Avatar';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';

// Mock data for current pack
const CURRENT_PACK = {
  id: '1',
  name: 'Appalachian Trail 2024',
  totalWeight: '12.4 lbs',
  baseWeight: '8.2 lbs',
  consumableWeight: '4.2 lbs',
  image:
    'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop',
  categories: [
    { name: 'Shelter', weight: '2.3 lbs', items: 3 },
    { name: 'Sleep System', weight: '1.8 lbs', items: 2 },
    { name: 'Cooking', weight: '0.9 lbs', items: 4 },
    { name: 'Water', weight: '0.6 lbs', items: 2 },
    { name: 'Clothing', weight: '1.5 lbs', items: 7 },
    { name: 'Electronics', weight: '0.7 lbs', items: 3 },
    { name: 'First Aid', weight: '0.4 lbs', items: 8 },
  ],
  items: [
    {
      id: '1',
      name: 'Tent',
      weight: '1.8 lbs',
      category: 'Shelter',
      worn: false,
      consumable: false,
    },
    {
      id: '2',
      name: 'Sleeping Bag',
      weight: '1.2 lbs',
      category: 'Sleep System',
      worn: false,
      consumable: false,
    },
    {
      id: '3',
      name: 'Sleeping Pad',
      weight: '0.6 lbs',
      category: 'Sleep System',
      worn: false,
      consumable: false,
    },
    {
      id: '4',
      name: 'Stove',
      weight: '0.3 lbs',
      category: 'Cooking',
      worn: false,
      consumable: false,
    },
    {
      id: '5',
      name: 'Pot',
      weight: '0.4 lbs',
      category: 'Cooking',
      worn: false,
      consumable: false,
    },
    {
      id: '6',
      name: 'Water Filter',
      weight: '0.2 lbs',
      category: 'Water',
      worn: false,
      consumable: false,
    },
    {
      id: '7',
      name: 'Water Bottle',
      weight: '0.4 lbs',
      category: 'Water',
      worn: false,
      consumable: false,
    },
    {
      id: '8',
      name: 'Food (5 days)',
      weight: '4.0 lbs',
      category: 'Food',
      worn: false,
      consumable: true,
    },
  ],
};

function WeightCard({
  title,
  weight,
  className,
}: {
  title: string;
  weight: string;
  className?: string;
}) {
  return (
    <View className={cn('flex-1 rounded-lg bg-card p-4', className)}>
      <Text variant="subhead" className="text-muted-foreground">
        {title}
      </Text>
      <Text variant="title2" className="mt-1 font-semibold">
        {weight}
      </Text>
    </View>
  );
}

// Custom list component to avoid issues with the List component
function CustomList({
  data,
  renderItem,
  keyExtractor,
}: {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  keyExtractor: (item: any, index: number) => string;
}) {
  return (
    <View>
      {data.map((item, index) => (
        <View key={keyExtractor(item, index)}>{renderItem(item, index)}</View>
      ))}
    </View>
  );
}

function CategoryItem({ category, index }: { category: any; index: number }) {
  const { colors } = useColorScheme();
  return (
    <View
      className={cn(
        'flex-row items-center justify-between p-4',
        index > 0 ? 'border-border/25 dark:border-border/80 border-t' : ''
      )}>
      <View>
        <Text>{category.name}</Text>
        <Text variant="footnote" className="text-muted-foreground">
          {category.weight} • {category.items} items
        </Text>
      </View>
      <View
        className="h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.grey4 }}>
        <Text variant="caption2" style={{ color: colors.grey }}>
          {category.items}
        </Text>
      </View>
    </View>
  );
}

function ItemRow({ item, index }: { item: any; index: number }) {
  return (
    <View
      className={cn(
        'flex-row items-center justify-between p-4',
        index > 0 ? 'border-border/25 dark:border-border/80 border-t' : ''
      )}>
      <View>
        <Text>{item.name}</Text>
        <Text variant="footnote" className="text-muted-foreground">
          {item.category}
        </Text>
      </View>
      <View className="flex-row items-center">
        {item.consumable && (
          <View className="mr-2 rounded-full bg-blue-100 px-2 py-0.5">
            <Text variant="caption2" className="text-blue-800">
              Consumable
            </Text>
          </View>
        )}
        {item.worn && (
          <View className="mr-2 rounded-full bg-green-100 px-2 py-0.5">
            <Text variant="caption2" className="text-green-800">
              Worn
            </Text>
          </View>
        )}
        <Text variant="subhead" className="text-muted-foreground">
          {item.weight}
        </Text>
      </View>
    </View>
  );
}

export default function CurrentPackScreen() {
  const params = useLocalSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);

  // Force a re-render after initial mount to fix layout issues
  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1" key={refreshKey}>
      <LargeTitleHeader title="Current Pack" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        removeClippedSubviews={false}>
        <View className="flex-row items-center p-4">
          <Avatar className="mr-4 h-16 w-16">
            <AvatarImage source={{ uri: CURRENT_PACK.image }} />
            <AvatarFallback>
              <Text>{CURRENT_PACK.name.substring(0, 2)}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex-1">
            <Text variant="title2" className="font-semibold">
              {CURRENT_PACK.name}
            </Text>
            <Text variant="subhead" className="mt-1 text-muted-foreground">
              Last updated: 2 days ago
            </Text>
          </View>
        </View>

        <View className="mb-4 flex-row gap-3 px-4">
          <WeightCard title="Total Weight" weight={CURRENT_PACK.totalWeight} />
          <WeightCard title="Base Weight" weight={CURRENT_PACK.baseWeight} />
        </View>

        {/* Categories Section */}
        <View className="mx-4 mb-6 rounded-lg bg-card">
          <View className="border-border/25 dark:border-border/80 border-b p-4">
            <Text variant="heading" className="font-semibold">
              Categories
            </Text>
          </View>

          <CustomList
            data={CURRENT_PACK.categories}
            keyExtractor={(item) => item.name}
            renderItem={(item, index) => <CategoryItem category={item} index={index} />}
          />
        </View>

        {/* Items Section */}
        <View className="mx-4 mb-8 mt-4 rounded-lg bg-card">
          <View className="border-border/25 dark:border-border/80 border-b p-4">
            <Text variant="heading" className="font-semibold">
              Items
            </Text>
          </View>

          <CustomList
            data={CURRENT_PACK.items}
            keyExtractor={(_, index) => index.toString()}
            renderItem={(item, index) => <ItemRow item={item} index={index} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
