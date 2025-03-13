import { useLocalSearchParams } from 'expo-router';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Chip } from '~/components/initial/Chip';
import WeightBadge from '~/components/initial/WeightBadge';
import { mockPackItems } from '../data/mockData';

export default function ItemDetailScreen() {
  const { id: itemId } = useLocalSearchParams();

  const item = mockPackItems.find((i) => i.id === itemId);

  if (!item) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Item not found</Text>
      </SafeAreaView>
    );
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
            <View>
              <Text className="mb-1 text-xs uppercase text-muted-foreground">WEIGHT (EACH)</Text>
              <WeightBadge weight={item.weight} unit={item.weightUnit} />
            </View>

            <View>
              <Text className="mb-1 text-xs uppercase text-muted-foreground">QUANTITY</Text>
              <Chip textClassName="text-center text-xs" variant="secondary">
                {item.quantity}
              </Chip>
            </View>

            <View>
              <Text className="mb-1 text-xs uppercase text-muted-foreground">TOTAL WEIGHT</Text>
              <WeightBadge weight={item.weight * item.quantity} unit={item.weightUnit} />
            </View>
          </View>

          <View className="mb-4 flex-row space-x-3">
            <View className="flex-row items-center">
              <Chip textClassName="text-center text-xs" variant="consumable">
                Consumable
              </Chip>
            </View>

            <View className="flex-row items-center">
              <Chip textClassName="text-center text-xs" variant="worn">
                Worn
              </Chip>
            </View>
          </View>

          {item.notes && (
            <View className="mt-2">
              <Text className="mb-1 text-xs text-muted-foreground">NOTES</Text>
              <Text className="text-foreground">{item.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
