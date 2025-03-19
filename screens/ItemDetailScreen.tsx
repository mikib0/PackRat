import { useLocalSearchParams, router } from 'expo-router';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Chip } from '~/components/initial/Chip';
import { WeightBadge } from '~/components/initial/WeightBadge';
import { useCatalogItems } from '~/hooks/useItems';
import { useAllPackItems } from '~/hooks/usePackItems';
import { Icon } from "@roninoss/icons"

import {
  calculateTotalWeight,
  getNotes,
  getQuantity,
  hasNotes,
  isConsumable,
  isPackItem,
  isWorn,
  shouldShowQuantity,
} from '~/lib/utils/itemCalculations';
import { LoadingSpinnerScreen } from './LoadingSpinnerScreen';
import { NotFoundScreen } from './NotFoundScreen';
import { Button } from "~/components/nativewindui/Button"

export function ItemDetailScreen() {
  const { id: itemId } = useLocalSearchParams();

  const {
    data: items,
    isLoading: isCatalogItemsLoading,
    isError: isCatalogItemsError,
  } = useCatalogItems();
  const {
    data: packItems,
    isLoading: isPackItemsLoading,
    isError: isPackItemsError,
  } = useAllPackItems();

  const item = items?.find((i) => i.id === itemId) || packItems?.find((i) => i.id === itemId);

  if (isCatalogItemsError || isPackItemsError) {
    return (
      <NotFoundScreen
        title="Item Not Found"
        message="The item you're looking for doesn't exist or has been moved."
        backButtonLabel="Go Back"
      />
    );
  }

  if (isCatalogItemsLoading || isPackItemsLoading) {
    return <LoadingSpinnerScreen />;
  }

  if (!item) {
    return (
      <NotFoundScreen
        title="Item Not Found"
        message="The item you're looking for doesn't exist or has been moved."
        backButtonLabel="Go Back"
      />
    );
  }

  // Get weight unit
  const weightUnit = item.weightUnit;

  // Use the utility functions
  const totalWeight = calculateTotalWeight(item);
  const quantity = getQuantity(item);
  const isItemConsumable = isConsumable(item);
  const showQuantity = shouldShowQuantity(item);
  const isItemWorn = isWorn(item);
  const itemHasNotes = hasNotes(item);
  const itemNotes = getNotes(item);

  const navigateToChat = () => {
    router.push({
      pathname: "/ai-chat-better-ui",
      params: {
        itemId: item.id,
        itemName: item.name,
        contextType: "item",
      },
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        {item.image && (
          <Image source={{ uri: item.image }} className="h-64 w-full" resizeMode="cover" />
        )}

        <View className="mb-4 bg-card p-4">
          <Text className="mb-1 text-2xl font-bold text-foreground">{item.name}</Text>
          <Text className="mb-3 text-muted-foreground">{item.category}</Text>

          {item.description && (
            <Text className="mb-4 text-muted-foreground">{item.description}</Text>
          )}

          <View className="mb-4 flex-row justify-between">
            {isPackItem(item) && (
              <View>
                <Text className="mb-1 text-xs uppercase text-muted-foreground">WEIGHT (EACH)</Text>
                <WeightBadge weight={item.weight} unit={item.weightUnit} />
              </View>
            )}

            {showQuantity && (
              <View>
                <Text className="mb-1 text-xs uppercase text-muted-foreground">QUANTITY</Text>
                <Chip textClassName="text-center text-xs" variant="secondary">
                  {quantity}
                </Chip>
              </View>
            )}

            {showQuantity && (
              <View>
                <Text className="mb-1 text-xs uppercase text-muted-foreground">TOTAL WEIGHT</Text>
                <WeightBadge weight={totalWeight} unit={weightUnit} />
              </View>
            )}
          </View>

          {isPackItem(item) && (
            <View className="mb-4 flex-row gap-3">
              {isItemConsumable && (
                <View className="flex-row items-center">
                  <Chip textClassName="text-center text-xs" variant="consumable">
                    Consumable
                  </Chip>
                </View>
              )}

              {isItemWorn && (
                <View className="flex-row items-center">
                  <Chip textClassName="text-center text-xs" variant="worn">
                    Worn
                  </Chip>
                </View>
              )}
            </View>
          )}

          {itemHasNotes && (
            <View className="mt-2">
              <Text className="mb-1 text-xs text-muted-foreground">NOTES</Text>
              <Text className="text-foreground">{itemNotes}</Text>
            </View>
          )}
        </View>
        <View className="mt-6 mb-8 px-4">
          <Button
            variant="primary"
            onPress={navigateToChat}
            className="flex-row items-center justify-center bg-primary py-3 px-4 rounded-full"
          >
            <Icon name='message' size={20} color="white" />
            <Text className="text-white font-semibold">Ask AI About This Item</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
