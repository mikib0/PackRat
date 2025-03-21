'use client';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '@roninoss/icons';
import { useCreateOrUpdateItem } from '~/hooks/usePackItems';
import { usePackItemSuggestions } from '~/hooks/usePackItemSuggestions';
import { cn } from '~/lib/cn';
import type { CatalogItem, PackItem } from '~/types';
import { PackItemSuggestionSkeleton } from './PackItemSuggestionSkeleton';
import { Button } from '~/components/nativewindui/Button';
import { useColorScheme } from '~/lib/useColorScheme';

interface AISuggestionsProps {
  packId: string;
  userId: string;
  packItems: PackItem[];
  onItemAdded?: () => void;
}

export function PackItemSuggestions({
  packId,
  userId,
  packItems,
  onItemAdded,
}: AISuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    data: suggestions,
    isLoading,
    refetch,
    isError,
  } = usePackItemSuggestions(packId, packItems, showSuggestions);

  const createItem = useCreateOrUpdateItem();
  const { colors } = useColorScheme();

  const handleAddItem = (item: CatalogItem) => {
    // Create a new pack item from the catalog item
    const newItem: Omit<PackItem, 'id'> = {
      name: item.name,
      description: item.description,
      weight: item.defaultWeight,
      weightUnit: item.weightUnit,
      quantity: 1,
      category: item.category,
      consumable: false,
      worn: false,
      image: item.image,
      notes: 'Added from AI suggestions',
      packId: packId,
      userId,
      catalogItemId: item.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createItem.mutate(newItem as any, {
      onSuccess: () => {
        if (onItemAdded) onItemAdded();
      },
    });
  };

  const handleGenerateSuggestions = () => {
    setShowSuggestions(true);
    refetch();
  };

  const handleHideSuggestions = () => {
    setShowSuggestions(false);
  };

  // If suggestions aren't being shown, display the generate button
  if (!showSuggestions) {
    return (
      <View className="bg-card p-4">
        <Button onPress={handleGenerateSuggestions} className="w-full" variant="secondary">
          <Icon name="atom" size={18} />
          <Text>Get AI Item Suggestions</Text>
        </Button>
      </View>
    );
  }

  // Show loading state
  if (isLoading) {
    return <PackItemSuggestionSkeleton hideSuggestions={handleHideSuggestions} />;
  }

  // Handle error state
  if (isError || !suggestions || suggestions.length === 0) {
    return (
      <View className="mb-4 bg-card p-4">
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Icon name="atom" size={18} />
            <Text className="text-base font-semibold text-gray-700">AI Suggestions</Text>
          </View>
          <TouchableOpacity
            onPress={handleHideSuggestions}
            className="rounded-full bg-gray-200 p-1">
            <Icon name="close" size={16} />
          </TouchableOpacity>
        </View>

        <Text className="mb-3 text-sm text-muted-foreground">
          {isError
            ? "Couldn't generate suggestions. Try again later."
            : 'No suggestions available for your pack.'}
        </Text>

        <Button onPress={() => refetch()} variant="secondary" className="w-full">
          <Icon name="power-cycle" size={16} />
          <Text>Try Again</Text>
        </Button>
      </View>
    );
  }

  // Show suggestions
  return (
    <View className="mb-4 bg-card p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Icon name="atom" size={18} />
          <Text className="text-base font-semibold text-gray-700">AI Suggestions</Text>
        </View>
        <TouchableOpacity onPress={handleHideSuggestions} className="rounded-full bg-gray-200 p-1">
          <Icon name="close" size={16} />
        </TouchableOpacity>
      </View>

      <Text className="mb-3 text-sm text-muted-foreground">
        Items you might want to add to your pack
      </Text>

      <FlatList
        data={suggestions}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        className="mb-2"
        renderItem={({ item }) => (
          <View className={cn('mr-3 rounded-lg border border-border p-3', 'w-40 bg-card')}>
            <Text className="mb-1 font-medium text-foreground" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="mb-2 text-xs text-muted-foreground" numberOfLines={2}>
              {item.description}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-muted-foreground">
                {item.defaultWeight}
                {item.weightUnit}
              </Text>
              <Button onPress={() => handleAddItem(item)} variant="tonal" size="icon">
                <Icon
                  name="plus"
                  color={Platform.OS === 'ios' ? colors.primary : colors.foreground}
                  size={21}
                />
              </Button>
            </View>
          </View>
        )}
      />
    </View>
  );
}
