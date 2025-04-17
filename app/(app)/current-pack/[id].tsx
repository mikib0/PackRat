'use client';

import type React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/nativewindui/Avatar';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import { usePackDetails } from '~/features/packs/hooks/usePackDetails';
import { Pack } from '~/features/packs';
import { CurrentPackSkeleton } from '~/components/SkeletonPlaceholder';

function WeightCard({
  title,
  weight,
  className,
}: {
  title: string;
  weight: number;
  className?: string;
}) {
  return (
    <View className={cn('flex-1 rounded-lg bg-card p-4', className)}>
      <Text variant="subhead" className="text-muted-foreground">
        {title}
      </Text>
      <Text variant="title2" className="mt-1 font-semibold">
        {weight} g
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
          {item.weight} {item.weightUnit}
        </Text>
      </View>
    </View>
  );
}

export default function CurrentPackScreen() {
  const params = useLocalSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: pack, isLoading, isError } = usePackDetails(params.id as string);

  function getUniqueCategories(pack: Pack | undefined) {
    const categoryMap: Record<string, { weight: number; items: number; weightUnit: string }> = {};

    pack?.items.forEach(
      (item: { category: any; weight: number; weightUnit: string; quantity: number }) => {
        const category = item.category;
        const weight = item.weight ?? 0;
        console.log(JSON.stringify(item));

        if (!categoryMap[category]) {
          categoryMap[category] = {
            weight: 0,
            items: 0,
            weightUnit: item.weightUnit,
          };
        }

        categoryMap[category].weight += weight * item.quantity;
        categoryMap[category].items += 1;
      }
    );

    return Object.entries(categoryMap).map(([name, data]) => ({
      name,
      items: data.items,
      weight: `${data.weight} ${data.weightUnit}`,
    }));
  }

  const uniqueCategories = getUniqueCategories(pack);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CurrentPackSkeleton />;
  }

  if (isError || !pack) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Failed to load pack data.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" key={refreshKey}>
      <LargeTitleHeader title="Current Pack" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        removeClippedSubviews={false}>
        <View className="flex-row items-center p-4">
          <Avatar className="mr-4 h-16 w-16" alt={''}>
            <AvatarImage source={{ uri: pack.image }} />
            <AvatarFallback>
              <Text>{pack.name.substring(0, 2)}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex-1">
            <Text variant="title2" className="font-semibold">
              {pack.name}
            </Text>
            <Text variant="subhead" className="mt-1 text-muted-foreground">
              Last updated: 2 days ago
            </Text>
          </View>
        </View>

        <View className="mb-4 flex-row gap-3 px-4">
          <WeightCard title="Total Weight" weight={pack?.totalWeight} />
          <WeightCard title="Base Weight" weight={pack?.baseWeight} />
        </View>

        {/* Categories Section */}
        <View className="mx-4 mb-6 rounded-lg bg-card">
          <View className="border-border/25 dark:border-border/80 border-b p-4">
            <Text variant="heading" className="font-semibold">
              Categories
            </Text>
          </View>

          <CustomList
            data={uniqueCategories}
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
            data={pack.items}
            keyExtractor={(_, index) => index.toString()}
            renderItem={(item, index) => <ItemRow item={item} index={index} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
