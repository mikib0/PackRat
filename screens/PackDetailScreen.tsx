'use client';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CategoryBadge from '~/components/initial/CategoryBadge';
import PackItemCard from '~/components/initial/PackItemCard';
import WeightBadge from '~/components/initial/WeightBadge';
import { Button } from '~/components/nativewindui/Button';
import { mockPacks } from '~/data/mockData';
import type { PackItem } from '~/types';

export default function PackDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const packId = id as string;
  const pack = mockPacks.find((p) => p.id === packId);
  const [activeTab, setActiveTab] = useState('all');

  if (!pack) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Pack not found</Text>
      </SafeAreaView>
    );
  }

  const handleItemPress = (item: PackItem) => {
    router.push(`/item/${item.id}`);
  };

  const filteredItems = () => {
    switch (activeTab) {
      case 'worn':
        return pack.items.filter((item) => item.worn);
      case 'consumable':
        return pack.items.filter((item) => item.consumable);
      case 'all':
      default:
        return pack.items;
    }
  };

  const getTabStyle = (tab: string) => {
    return activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {pack.image && (
          <Image source={{ uri: pack.image }} className="h-48 w-full" resizeMode="cover" />
        )}

        <View className="mb-4 bg-white p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-gray-900">{pack.name}</Text>
            <CategoryBadge category={pack.category} />
          </View>

          {pack.description && <Text className="mb-4 text-gray-600">{pack.description}</Text>}

          <View className="mb-4 flex-row justify-between">
            <View>
              <Text className="mb-1 text-xs text-gray-500">BASE WEIGHT</Text>
              <WeightBadge weight={pack.baseWeight || 0} unit="g" type="base" />
            </View>

            <View>
              <Text className="mb-1 text-xs text-gray-500">TOTAL WEIGHT</Text>
              <WeightBadge weight={pack.totalWeight || 0} unit="g" type="total" />
            </View>

            <View>
              <Text className="mb-1 text-xs text-gray-500">ITEMS</Text>
              <View className="rounded-full bg-gray-100 px-2 py-1">
                <Text className="text-xs font-medium text-gray-800">{pack.items.length}</Text>
              </View>
            </View>
          </View>

          {pack.tags && pack.tags.length > 0 && (
            <View className="flex-row flex-wrap">
              {pack.tags.map((tag, index) => (
                <View key={index} className="mb-1 mr-2 rounded-full bg-gray-100 px-2 py-1">
                  <Text className="text-xs text-gray-600">#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className="bg-white">
          <View className="flex-row border-b border-gray-200">
            <TouchableOpacity
              className={`flex-1 items-center py-3 ${getTabStyle('all')}`}
              onPress={() => setActiveTab('all')}>
              <Text className={getTabStyle('all')}>All Items</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 items-center py-3 ${getTabStyle('worn')}`}
              onPress={() => setActiveTab('worn')}>
              <Text className={getTabStyle('worn')}>Worn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 items-center py-3 ${getTabStyle('consumable')}`}
              onPress={() => setActiveTab('consumable')}>
              <Text className={getTabStyle('consumable')}>Consumable</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredItems()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="px-4 pt-3">
                <PackItemCard item={item} onPress={handleItemPress} />
              </View>
            )}
            ListEmptyComponent={
              <View className="items-center justify-center p-4">
                <Text className="text-gray-500">No items found</Text>
              </View>
            }
            scrollEnabled={false}
          />

          <Button className="m-4" onPress={() => router.push('/item/new')}>
            <Text>Add New Item</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
