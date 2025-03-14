'use client';

import { Icon } from '@roninoss/icons';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { searchValueAtom } from '~/atoms/itemListAtoms';
import { ItemCard } from '~/components/initial/ItemCard';
import { useItems } from '../hooks/useItems';
import type { Item, ItemCategory } from '../types';

type FilterOption = {
  label: string;
  value: ItemCategory | 'all' | 'pack-items' | 'plain-items';
};

const filterOptions: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Pack Items', value: 'pack-items' },
  { label: 'Plain Items', value: 'plain-items' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Shelter', value: 'shelter' },
  { label: 'Sleep', value: 'sleep' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Water', value: 'water' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'First Aid', value: 'first-aid' },
  { label: 'Navigation', value: 'navigation' },
  { label: 'Tools', value: 'tools' },
  { label: 'Consumables', value: 'consumables' },
  { label: 'Miscellaneous', value: 'miscellaneous' },
];

export function ItemListScreen() {
  const router = useRouter();
  const { data: items, isLoading, isError, refetch } = useItems();
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [activeFilter, setActiveFilter] = useState<
    ItemCategory | 'all' | 'pack-items' | 'plain-items'
  >('all');

  const handleItemPress = (item: Item) => {
    // Navigate to item detail screen
    router.push({ pathname: '/item/[id]', params: { id: item.id } });
  };

  const handleCreateItem = () => {
    // Navigate to create item screen
    router.push({ pathname: '/item/new' });
  };

  const filteredItems = items?.filter((item) => {
    // Filter by search value
    if (searchValue && !item.name.toLowerCase().includes(searchValue.toLowerCase())) {
      return false;
    }

    // Filter by category
    if (activeFilter === 'all') {
      return true;
    } else if (activeFilter === 'pack-items') {
      return item.packId !== undefined;
    } else if (activeFilter === 'plain-items') {
      return item.packId === undefined;
    } else {
      return item.category === activeFilter;
    }
  });

  const renderFilterChip = ({ label, value }: FilterOption) => (
    <TouchableOpacity
      key={value}
      onPress={() => setActiveFilter(value)}
      className={`mr-2 rounded-full px-4 py-2 ${activeFilter === value ? 'bg-primary' : 'bg-card'}`}>
      <Text
        className={`text-sm font-medium ${activeFilter === value ? 'text-primary-foreground' : 'text-foreground'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-red-500">Failed to load items</Text>
        <TouchableOpacity
          className="mt-4 rounded-lg bg-primary px-4 py-2"
          onPress={() => refetch()}>
          <Text className="font-medium text-primary-foreground">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-background px-4 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
          {filterOptions.map(renderFilterChip)}
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator className="text-primary" size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="px-4 pt-4">
              <ItemCard item={item} onPress={handleItemPress} />
            </View>
          )}
          ListHeaderComponent={
            <View className="px-4 pb-0 pt-2">
              <Text className="text-muted-foreground">
                {filteredItems?.length} {filteredItems?.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-8">
              <View className="mb-4 rounded-full bg-muted p-4">
                <Icon name="backpack" size={32} color="text-muted-foreground" />
              </View>
              <Text className="mb-1 text-lg font-medium text-foreground">No items found</Text>
              <Text className="mb-6 text-center text-muted-foreground">
                {activeFilter === 'all'
                  ? "You haven't added any items yet."
                  : activeFilter === 'pack-items'
                    ? "You don't have any items in packs."
                    : activeFilter === 'plain-items'
                      ? "You don't have any standalone items."
                      : `You don't have any ${activeFilter} items.`}
              </Text>
              <TouchableOpacity
                className="rounded-lg bg-primary px-4 py-2"
                onPress={handleCreateItem}>
                <Text className="font-medium text-primary-foreground">Add New Item</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}
    </SafeAreaView>
  );
}
