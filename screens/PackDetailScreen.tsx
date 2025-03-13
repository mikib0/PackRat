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
import { Badge } from '~/components/initial/Badge';
import CategoryBadge from '~/components/initial/CategoryBadge';
import PackItemCard from '~/components/initial/PackItemCard';
import WeightBadge from '~/components/initial/WeightBadge';
import { Button } from '~/components/nativewindui/Button';
import { mockPacks } from '~/data/mockData';
import { cn } from '~/lib/cn';
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
    return cn(
      'flex-1 items-center py-4',
      activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        {pack.image && (
          <Image source={{ uri: pack.image }} className="h-48 w-full" resizeMode="cover" />
        )}

        <View className="mb-4 bg-card p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">{pack.name}</Text>
            <CategoryBadge category={pack.category} />
          </View>

          {pack.description && (
            <Text className="mb-4 text-muted-foreground">{pack.description}</Text>
          )}

          <View className="mb-4 flex-row justify-between">
            <View>
              <Text className="mb-1 text-xs text-muted-foreground">BASE WEIGHT</Text>
              <WeightBadge weight={pack.baseWeight || 0} unit="g" type="base" />
            </View>

            <View>
              <Text className="mb-1 text-xs text-muted-foreground">TOTAL WEIGHT</Text>
              <WeightBadge weight={pack.totalWeight || 0} unit="g" type="total" />
            </View>

            <View>
              <Text className="mb-1 text-xs text-muted-foreground">ITEMS</Text>
              <Badge className="text-center text-xs" variant="default">
                {pack.items.length}
              </Badge>
            </View>
          </View>

          {pack.tags && pack.tags.length > 0 && (
            <View className="flex-row flex-wrap">
              {pack.tags.map((tag, index) => (
                <Badge key={index} className="mb-1 mr-2 text-center text-xs" variant="default">
                  #{tag}
                </Badge>
              ))}
            </View>
          )}
        </View>

        <View className="bg-card">
          <View className="flex-row border-b border-border">
            <TouchableOpacity className={getTabStyle('all')} onPress={() => setActiveTab('all')}>
              <Text className={getTabStyle('all')}>All Items</Text>
            </TouchableOpacity>

            <TouchableOpacity className={getTabStyle('worn')} onPress={() => setActiveTab('worn')}>
              <Text className={getTabStyle('worn')}>Worn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={getTabStyle('consumable')}
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
                <Text className="text-muted-foreground">No items found</Text>
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
