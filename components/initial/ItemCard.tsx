import { Icon, MaterialIconName } from '@roninoss/icons';
import { Image, Pressable, Text, View } from 'react-native';
import type { Item } from '~/types';
import { CategoryBadge } from '../initial/CategoryBadge';
import { WeightBadge } from '../initial/WeightBadge';

type ItemCardProps = {
  item: Item;
  onPress: (item: Item) => void;
};

export function ItemCard({ item, onPress }: ItemCardProps) {
  // Calculate total weight (weight × quantity)
  const totalWeight = item.weight * item.quantity;

  // Check if item belongs to a pack
  const isPackItem = !!item.packId;

  return (
    <Pressable
      className="mb-4 overflow-hidden rounded-xl bg-card shadow-sm"
      onPress={() => onPress(item)}>
      <View className="flex-row">
        {item.image ? (
          <Image source={{ uri: item.image }} className="h-24 w-24" resizeMode="cover" />
        ) : (
          <View className="h-24 w-24 items-center justify-center bg-muted">
            <Icon
              name={getCategoryIcon(item.category) as MaterialIconName}
              size={32}
              color="text-muted-foreground"
            />
          </View>
        )}

        <View className="flex-1 p-4">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-foreground">{item.name}</Text>
            {isPackItem && (
              <View className="bg-primary/20 rounded-full px-2 py-0.5">
                <Text className="text-xs text-primary">Pack Item</Text>
              </View>
            )}
          </View>

          <View className="mb-2 flex-row items-center">
            <CategoryBadge category={item.category} />
            {item.consumable && (
              <View className="ml-2 rounded-full bg-amber-100 px-2 py-0.5">
                <Text className="text-xs text-amber-800">Consumable</Text>
              </View>
            )}
            {item.worn && (
              <View className="ml-2 rounded-full bg-blue-100 px-2 py-0.5">
                <Text className="text-xs text-blue-800">Worn</Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center justify-between">
            <WeightBadge weight={totalWeight} unit={item.weightUnit} type="total" />
            <Text className="text-xs text-foreground">Qty: {item.quantity}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// Helper function to get icon based on category
function getCategoryIcon(category: string): MaterialIconName {
  switch (category) {
    case 'clothing':
      return 'account-voice';
    case 'shelter':
      return 'home';
    case 'sleep':
      return 'sleep';
    case 'kitchen':
      return 'silverware-fork-knife';
    case 'water':
      return 'water';
    case 'electronics':
      return 'cellphone';
    case 'first-aid':
      return 'bandage';
    case 'navigation':
      return 'map';
    case 'tools':
      return 'wrench';
    case 'consumables':
      return 'apple';
    default:
      return 'square-outline';
  }
}
