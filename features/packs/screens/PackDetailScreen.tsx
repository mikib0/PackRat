import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { CategoryBadge } from '~/components/initial/CategoryBadge';
import { Chip } from '~/components/initial/Chip';
import { PackItemCard } from '~/components/initial/PackItemCard';
import { WeightBadge } from '~/components/initial/WeightBadge';
import { Button } from '~/components/nativewindui/Button';
import { useDeletePack, usePackDetails } from '../hooks';
import { cn } from '~/lib/cn';
import { NotFoundScreen } from '~/screens/NotFoundScreen';
import type { PackItem } from '~/types';
import { ErrorScreen } from '../../../screens/ErrorScreen';
import { LoadingSpinnerScreen } from '../../../screens/LoadingSpinnerScreen';
import { Icon } from '@roninoss/icons';
import { Alert } from '~/components/nativewindui/Alert';
import { PackItemSuggestions } from '~/components/initial/PackItemSuggestions';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';

export function PackDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState('all');

  const { data: pack, isLoading, isError, refetch } = usePackDetails(id as string);
  const deletePack = useDeletePack();
  const { colors } = useColorScheme();

  const handleItemPress = (item: PackItem) => {
    if (!item.id) return;
    router.push(`/item/${item.id}`);
  };

  const getFilteredItems = () => {
    if (!pack?.items) return [];

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

  const filteredItems = getFilteredItems();

  const getTabStyle = (tab: string) => {
    return cn(
      'flex-1 items-center py-4',
      activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
    );
  };

  if (isLoading) {
    return <LoadingSpinnerScreen />;
  }

  if (isError) {
    return (
      <ErrorScreen
        title="Error loading pack"
        message="Please try again later."
        onRetry={refetch}
        variant="destructive"
      />
    );
  }

  if (!pack) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <NotFoundScreen title="Pack not found" message="Please try again later." />
      </SafeAreaView>
    );
  }

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
              <Text className="mb-1 text-xs uppercase text-muted-foreground">BASE WEIGHT</Text>
              <WeightBadge weight={pack.baseWeight || 0} unit="g" type="base" />
            </View>

            <View>
              <Text className="mb-1 text-xs uppercase text-muted-foreground">TOTAL WEIGHT</Text>
              <WeightBadge weight={pack.totalWeight || 0} unit="g" type="total" />
            </View>

            <View>
              <Text className="mb-1 text-xs uppercase text-muted-foreground">ITEMS</Text>
              <Chip textClassName="text-center text-xs" variant="secondary">
                {pack.items?.length || 0}
              </Chip>
            </View>
          </View>

          <View className="flex-row justify-between">
            {pack.tags && pack.tags.length > 0 && (
              <View className="flex-row flex-wrap">
                {pack.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    className="mb-1 mr-2"
                    textClassName="text-xs text-center"
                    variant="outline">
                    #{tag}
                  </Chip>
                ))}
              </View>
            )}
            <Alert
              title="Delete pack?"
              message="Are you sure you want to delete this pack? This action cannot be undone."
              buttons={[
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    deletePack.mutate(pack.id, {
                      onSuccess: () => {
                        // If we're on the pack detail screen, navigate back
                        if (router.canGoBack()) {
                          router.back();
                        }
                      },
                    });
                  },
                },
              ]}>
              <Button variant="plain" size="icon">
                <Icon name="trash-can" color={colors.grey2} size={21} />
              </Button>
            </Alert>
          </View>
        </View>

        <View className="bg-card">
          <View className="p-4">
            <Button
              variant="secondary"
              onPress={() =>
                router.push({
                  pathname: '/ai-chat-better-ui',
                  params: { packId: id, packName: pack.name, contextType: 'pack' },
                })
              }>
              <Icon name="message-outline" color={colors.foreground} />
              <Text>Ask AI</Text>
            </Button>
          </View>

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
            data={filteredItems}
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

          {/* AI Suggestions Section */}
          {filteredItems.length && (
            <PackItemSuggestions
              packId={pack.id}
              userId={pack.userId}
              packItems={pack.items || []}
              onItemAdded={refetch}
            />
          )}

          <Button
            className="m-4"
            onPress={() => router.push({ pathname: '/item/new', params: { packId: pack.id } })}>
            <Text>Add New Item</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
