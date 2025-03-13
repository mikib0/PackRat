import { Icon } from '@roninoss/icons';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import WeightBadge from '~/components/initial/WeightBadge';
import { mockPackItems } from '../data/mockData';

export default function ItemDetailScreen({ route, navigation }: any) {
  // In a real app, you would get the item ID from route.params
  const itemId = '101'; // Mock ID
  const item = mockPackItems.find((i) => i.id === itemId);

  if (!item) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Item not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center border-b border-gray-200 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => console.log('Go back')} className="mr-3">
          <Icon name="chevron-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-semibold text-gray-900">{item.name}</Text>
        <TouchableOpacity className="mr-4">
          <Icon name="pencil-box-outline" size={20} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="trash-can-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {item.image && (
          <Image source={{ uri: item.image }} className="h-64 w-full" resizeMode="cover" />
        )}

        <View className="mb-4 bg-white p-4">
          <Text className="mb-1 text-2xl font-bold text-gray-900">{item.name}</Text>
          <Text className="mb-3 text-gray-500">{item.category}</Text>

          {item.description && <Text className="mb-4 text-gray-600">{item.description}</Text>}

          <View className="mb-4 flex-row justify-between">
            <View>
              <Text className="mb-1 text-xs text-gray-500">WEIGHT (EACH)</Text>
              <WeightBadge weight={item.weight} unit={item.weightUnit} />
            </View>

            <View>
              <Text className="mb-1 text-xs text-gray-500">QUANTITY</Text>
              <View className="rounded-full bg-gray-100 px-2 py-1">
                <Text className="text-xs font-medium text-gray-800">{item.quantity}</Text>
              </View>
            </View>

            <View>
              <Text className="mb-1 text-xs text-gray-500">TOTAL WEIGHT</Text>
              <WeightBadge weight={item.weight * item.quantity} unit={item.weightUnit} />
            </View>
          </View>

          <View className="mb-4 flex-row space-x-3">
            <View className="flex-row items-center">
              <View
                className={`mr-1 h-4 w-4 rounded-full ${item.consumable ? 'bg-orange-500' : 'bg-gray-300'}`}
              />
              <Text className="text-gray-700">Consumable</Text>
            </View>

            <View className="flex-row items-center">
              <View
                className={`mr-1 h-4 w-4 rounded-full ${item.worn ? 'bg-green-500' : 'bg-gray-300'}`}
              />
              <Text className="text-gray-700">Worn</Text>
            </View>
          </View>

          {item.notes && (
            <View className="mt-2">
              <Text className="mb-1 text-xs text-gray-500">NOTES</Text>
              <Text className="text-gray-700">{item.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
