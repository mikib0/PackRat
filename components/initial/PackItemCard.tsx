import { Image, Pressable, Text, View } from 'react-native';
import WeightBadge from '~/components/initial/WeightBadge';
import type { PackItem } from '~/types';

type PackItemCardProps = {
  item: PackItem;
  onPress: (item: PackItem) => void;
};

export default function PackItemCard({ item, onPress }: PackItemCardProps) {
  return (
    <Pressable
      className="mb-3 flex-row overflow-hidden rounded-lg bg-white shadow-sm"
      onPress={() => onPress(item)}>
      {item.image ? (
        <Image source={{ uri: item.image }} className="h-20 w-20" resizeMode="cover" />
      ) : (
        <View className="h-20 w-20 items-center justify-center bg-gray-200">
          <Text className="text-gray-400">No image</Text>
        </View>
      )}

      <View className="flex-1 p-3">
        <View className="flex-row items-start justify-between">
          <View className="mr-2 flex-1">
            <Text className="text-base font-medium text-gray-900" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="mb-1 text-xs text-gray-500">{item.category}</Text>
          </View>

          <WeightBadge weight={item.weight * item.quantity} unit={item.weightUnit} />
        </View>

        {item.description && (
          <Text className="mt-1 text-sm text-gray-600" numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View className="mt-2 flex-row space-x-2">
          {item.quantity > 1 && (
            <View className="rounded-full bg-gray-100 px-2 py-0.5">
              <Text className="text-xs text-gray-600">Qty: {item.quantity}</Text>
            </View>
          )}

          {item.consumable && (
            <View className="rounded-full bg-orange-100 px-2 py-0.5">
              <Text className="text-xs text-orange-600">Consumable</Text>
            </View>
          )}

          {item.worn && (
            <View className="rounded-full bg-green-100 px-2 py-0.5">
              <Text className="text-xs text-green-600">Worn</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
