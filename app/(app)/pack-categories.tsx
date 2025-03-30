import { Icon } from '@roninoss/icons';
import { View, ScrollView } from 'react-native';

import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

// Mock data for pack categories
const CATEGORIES = [
  {
    id: '1',
    name: 'Shelter',
    itemCount: 3,
    totalWeight: '2.3 lbs',
    icon: 'home',
    color: '#FF6384',
  },
  {
    id: '2',
    name: 'Sleep System',
    itemCount: 2,
    totalWeight: '1.8 lbs',
    icon: 'power-sleep',
    color: '#36A2EB',
  },
  {
    id: '3',
    name: 'Cooking',
    itemCount: 4,
    totalWeight: '0.9 lbs',
    icon: 'fire',
    color: '#FFCE56',
  },
  {
    id: '4',
    name: 'Water',
    itemCount: 2,
    totalWeight: '0.6 lbs',
    icon: 'water',
    color: '#4BC0C0',
  },
  {
    id: '5',
    name: 'Clothing',
    itemCount: 7,
    totalWeight: '1.5 lbs',
    icon: 'backpack',
    color: '#9966FF',
  },
  {
    id: '6',
    name: 'Electronics',
    itemCount: 3,
    totalWeight: '0.7 lbs',
    icon: 'cellphone',
    color: '#FF9F40',
  },
  {
    id: '7',
    name: 'First Aid',
    itemCount: 8,
    totalWeight: '0.4 lbs',
    icon: 'bandage',
    color: '#C9CBCF',
  },
];

function CategoryCard({ category }: { category: (typeof CATEGORIES)[0] }) {
  const { colors } = useColorScheme();

  return (
    <View className="mx-4 mb-3 overflow-hidden rounded-xl bg-card shadow-sm">
      <View className="flex-row items-center p-4">
        <View
          className="h-12 w-12 items-center justify-center rounded-md"
          style={{ backgroundColor: category.color }}>
          <Icon name={category.icon} size={24} color="white" />
        </View>

        <View className="ml-4 flex-1">
          <Text variant="heading" className="font-semibold">
            {category.name}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text variant="subhead" className="text-muted-foreground">
              {category.itemCount} items
            </Text>
            <View className="flex-row items-center gap-1">
              <Icon name="dumbbell" size={14} color={colors.grey3} />
              <Text variant="subhead" className="text-muted-foreground">
                {category.totalWeight}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function PackCategoriesScreen() {
  return (
    <>
      <LargeTitleHeader title="Pack Categories" />
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text variant="subhead" className="mb-2 text-muted-foreground">
            Organize your gear by functional categories
          </Text>
        </View>

        <View className="pb-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}
