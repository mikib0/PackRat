import { useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native'; // 👈 import ActivityIndicator

import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import { Text } from '~/components/nativewindui/Text';
import { PackItemCard } from '~/features/packs/components/PackItemCard';
import { useUserPackItems } from '~/features/packs/hooks/useUserPackItem';
import { cn } from '~/lib/cn';
import type { PackItem } from '~/types';

function CategorySection({ category, items }: { category: string; items: PackItem[] }) {
  return (
    <View className="mb-4">
      <View className="bg-primary/10 px-4 py-2">
        <Text variant="subhead" className="font-semibold">
          {category} ({items.length})
        </Text>
      </View>
      <View className="mt-3">
        {items.map((item) => (
          <PackItemCard key={item.id} item={item} onPress={() => {}} />
        ))}
      </View>
    </View>
  );
}

export default function GearInventoryScreen() {
  const [viewMode, setViewMode] = useState<'all' | 'category'>('all');
  const { data: items = [], isLoading } = useUserPackItems();

  const groupByCategory = (items: PackItem[]) => {
    return items.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, PackItem[]>
    );
  };

  const itemsByCategory = groupByCategory(items);

  return (
    <>
      <LargeTitleHeader title="Gear Inventory" />
      <ScrollView className="flex-1">
        <View className="flex-row items-center justify-between p-4">
          <Text variant="subhead" className="text-muted-foreground">
            {items?.length} items in your inventory
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

        {isLoading ? (
          <View className="mt-20 flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : viewMode === 'all' ? (
          <View className="pb-4">
            {items?.map((item) => <PackItemCard key={item.id} item={item} onPress={() => {}} />)}
          </View>
        ) : (
          <View className="pb-4">
            {Object.entries(itemsByCategory).map(([category, groupedItems]) => (
              <CategorySection key={category} category={category} items={groupedItems} />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}
