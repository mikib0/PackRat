import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '@roninoss/icons';
import type { CatalogItem } from '~/types';

type CatalogItemCardProps = {
  item: CatalogItem;
  onPress: () => void;
};

export function CatalogItemCard({ item, onPress }: CatalogItemCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-3 overflow-hidden rounded-lg bg-card shadow-sm">
      <View className="flex-row">
        <Image source={{ uri: item.image }} className="h-24 w-24 rounded-l-lg" resizeMode="cover" />
        <View className="flex-1 justify-between p-3">
          <View>
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
              {item.ratingValue && (
                <View className="flex-row items-center">
                  <Icon name="star" size={14} color="text-amber-500" />
                  <Text className="ml-1 text-xs text-muted-foreground">
                    {item.ratingValue.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
            {item.brand && <Text className="text-xs text-muted-foreground">{item.brand}</Text>}
            <Text className="mt-1 text-xs text-muted-foreground" numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <View className="mt-2 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Icon name="dumbbell" size={14} color="text-muted-foreground" />
              <Text className="ml-1 text-xs text-muted-foreground">
                {item.defaultWeight} {item.weightUnit}
              </Text>
            </View>
            {item.usageCount > 0 && (
              <View className="flex-row items-center">
                <Icon name="backpack" size={14} color="text-muted-foreground" />
                <Text className="ml-1 text-xs text-muted-foreground">
                  used in {item.usageCount} {item.usageCount === 1 ? 'pack' : 'packs'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
