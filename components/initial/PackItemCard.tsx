import { Image, Pressable, Text, View } from 'react-native';
import { WeightBadge } from '~/components/initial/WeightBadge';
import { cn } from '~/lib/cn';
import type { PackItem } from '~/types';

type PackItemCardProps = {
  item: PackItem;
  onPress: (item: PackItem) => void;
};

export function PackItemCard({ item, onPress }: PackItemCardProps) {
  return (
    <Pressable
      className="mb-3 flex-row overflow-hidden rounded-lg bg-card shadow-sm"
      onPress={() => onPress(item)}>
      {item.image ? (
        <Image source={{ uri: item.image }} className="h-20 w-20" resizeMode="cover" />
      ) : (
        <View className="h-20 w-20 items-center justify-center bg-muted">
          <Text className="text-muted-foreground">No image</Text>
        </View>
      )}

      <View className="flex-1 p-3">
        <View className="flex-row items-start justify-between">
          <View className="mr-2 flex-1">
            <Text className="text-base font-medium text-foreground" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="mb-1 text-xs text-muted-foreground">{item.category}</Text>
          </View>

          <WeightBadge weight={item.weight * item.quantity} unit={item.weightUnit} />
        </View>

        {item.description && (
          <Text className="mt-1 text-sm text-muted-foreground" numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View className="mt-2 flex-row gap-2">
          {item.quantity > 1 && (
            <View className="rounded-full bg-muted px-2 py-0.5">
              <Text className="text-xs text-muted-foreground">Qty: {item.quantity}</Text>
            </View>
          )}

          {item.consumable && (
            <View className={cn('rounded-full px-2 py-0.5', 'bg-amber-100')}>
              <Text className={cn('text-xs', 'text-amber-600')}>Consumable</Text>
            </View>
          )}

          {item.worn && (
            <View className={cn('rounded-full px-2 py-0.5', 'bg-emerald-100')}>
              <Text className={cn('text-xs', 'text-emerald-600')}>Worn</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
