import { useLocalSearchParams } from 'expo-router';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import WeightBadge from '~/components/initial/WeightBadge';
import { cn } from '~/lib/cn';
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
              <Text className="mb-1 text-xs text-muted-foreground">WEIGHT (EACH)</Text>
              <WeightBadge weight={item.weight} unit={item.weightUnit} />
            </View>

            <View>
              <Text className="mb-1 text-xs text-muted-foreground">QUANTITY</Text>
              <View className="rounded-full bg-muted px-2 py-1">
                <Text className="text-xs font-medium text-foreground">{item.quantity}</Text>
              </View>
            </View>

            <View>
              <Text className="mb-1 text-xs text-muted-foreground">TOTAL WEIGHT</Text>
              <WeightBadge weight={item.weight * item.quantity} unit={item.weightUnit} />
            </View>
          </View>

          <View className="mb-4 flex-row space-x-3">
            <View className="flex-row items-center">
              <View
                className={cn(
                  'mr-1 h-4 w-4 rounded-full',
                  item.consumable ? 'bg-amber-500' : 'bg-muted'
                )}
              />
              <Text className="text-foreground">Consumable</Text>
            </View>

            <View className="flex-row items-center">
              <View
                className={cn(
                  'mr-1 h-4 w-4 rounded-full',
                  item.worn ? 'bg-emerald-500' : 'bg-muted'
                )}
              />
              <Text className="text-foreground">Worn</Text>
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
