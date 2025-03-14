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
import { searchValueAtom } from '~/atoms/packListAtoms';
import { PackCard } from '~/components/initial/PackCard';
import { usePacks } from '../hooks/usePacks';
import type { Pack, PackCategory } from '../types';

type FilterOption = {
  label: string;
  value: PackCategory | 'all';
};

const filterOptions: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Hiking', value: 'hiking' },
  { label: 'Backpacking', value: 'backpacking' },
  { label: 'Camping', value: 'camping' },
  { label: 'Climbing', value: 'climbing' },
  { label: 'Winter', value: 'winter' },
  { label: 'Desert', value: 'desert' },
  { label: 'Custom', value: 'custom' },
];

export function PackListScreen() {
  const router = useRouter();
  const { data: packs, isLoading, isError, refetch } = usePacks();
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [activeFilter, setActiveFilter] = useState<PackCategory | 'all'>('all');

  const handlePackPress = (pack: Pack) => {
    // Navigate to pack detail screen
    router.push({ pathname: '/pack/[id]', params: { id: pack.id } });
  };

  const handleCreatePack = () => {
    // Navigate to create pack screen
    router.push({ pathname: '/pack/new' });
  };

  const filteredPacks =
    activeFilter === 'all'
      ? packs
      : packs?.filter(
          (pack) =>
            pack.category === activeFilter &&
            pack.name.toLowerCase().includes(searchValue.toLowerCase())
        );

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
        <Text className="text-red-500">Failed to load packs</Text>
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
          data={filteredPacks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="px-4 pt-4">
              <PackCard pack={item} onPress={handlePackPress} />
            </View>
          )}
          ListHeaderComponent={
            <View className="px-4 pb-0 pt-2">
              <Text className="text-muted-foreground">
                {filteredPacks?.length} {filteredPacks?.length === 1 ? 'pack' : 'packs'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-8">
              <View className="mb-4 rounded-full bg-muted p-4">
                <Icon name="cog-outline" size={32} color="text-muted-foreground" />
              </View>
              <Text className="mb-1 text-lg font-medium text-foreground">No packs found</Text>
              <Text className="mb-6 text-center text-muted-foreground">
                {activeFilter === 'all'
                  ? "You haven't created any packs yet."
                  : `You don't have any ${activeFilter} packs.`}
              </Text>
              <TouchableOpacity
                className="rounded-lg bg-primary px-4 py-2"
                onPress={handleCreatePack}>
                <Text className="font-medium text-primary-foreground">Create New Pack</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}
    </SafeAreaView>
  );
}
