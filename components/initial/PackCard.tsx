import { isArray } from 'radash';
import { Image, Pressable, Text, View } from 'react-native';
import type { Pack } from '~/types';
import { CategoryBadge } from './CategoryBadge';
import { WeightBadge } from './WeightBadge';

type PackCardProps = {
  pack: Pack;
  onPress: (pack: Pack) => void;
};

export function PackCard({ pack, onPress }: PackCardProps) {
  // Safely check if weights exist and are greater than 0
  const hasBaseWeight = typeof pack.baseWeight === 'number' && pack.baseWeight > 0;
  const hasTotalWeight = typeof pack.totalWeight === 'number' && pack.totalWeight > 0;

  return (
    <Pressable
      className="mb-4 overflow-hidden rounded-xl bg-card shadow-sm"
      onPress={() => onPress(pack)}>
      {pack.image && (
        <Image source={{ uri: pack.image }} className="h-40 w-full" resizeMode="cover" />
      )}
      <View className="p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-foreground">{pack.name}</Text>
          <CategoryBadge category={pack.category} />
        </View>

        {pack.description && (
          <Text className="mb-3 text-foreground" numberOfLines={2}>
            {pack.description}
          </Text>
        )}

        <View className="flex-row items-center justify-between">
          <View className="flex-row space-x-2">
            {hasBaseWeight ? (
              <WeightBadge weight={pack.baseWeight ?? 0} unit="g" type="base" />
            ) : null}
            {hasTotalWeight ? (
              <WeightBadge weight={pack.totalWeight ?? 0} unit="g" type="total" />
            ) : null}
          </View>
          {pack.items && isArray(pack.items) && pack.items.length > 0 ? (
            <Text className="text-xs text-foreground">{pack.items.length} items</Text>
          ) : null}
        </View>

        {pack.tags && isArray(pack.tags) && pack.tags.length > 0 ? (
          <View className="mt-3 flex-row flex-wrap">
            {pack.tags.map((tag, index) => (
              <View key={index} className="mb-1 mr-2 rounded-full bg-background px-2 py-1">
                <Text className="text-xs text-foreground">#{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
