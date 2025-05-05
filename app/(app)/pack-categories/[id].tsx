import { Icon } from '@roninoss/icons';
import { useLocalSearchParams } from 'expo-router';
import { View, ScrollView } from 'react-native';

import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import { Text } from '~/components/nativewindui/Text';
import { usePackDetails } from '~/features/packs/hooks/usePackDetails';
import { useColorScheme } from '~/lib/useColorScheme';

function CategoryCard({
  category,
}: {
  category: {
    name: string;
    items: number;
    weight: { value: number; unit: string };
    percentage: number;
  };
}) {
  const { colors } = useColorScheme();
  const itemLabel = category.items === 1 ? 'item' : 'items';

  return (
    <View className="mx-4 mb-3 overflow-hidden rounded-xl bg-card shadow-sm">
      <View className="flex-row items-center p-4">
        <View
          className="h-12 w-12 items-center justify-center rounded-md"
          style={{ backgroundColor: colors.grey4 }}>
          <Icon name={category.icon || 'backpack'} size={24} color="white" />
        </View>

        <View className="ml-4 flex-1">
          <Text variant="heading" className="font-semibold">
            {category.name}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text variant="subhead" className="text-muted-foreground">
              {category.items} {itemLabel}
            </Text>
            <View className="flex-row items-center gap-1">
              <Icon name="dumbbell" size={14} color={colors.grey3} />
              <Text variant="subhead" className="text-muted-foreground">
                {category.weight.value} {category.weight.unit}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function PackCategoriesScreen() {
  const params = useLocalSearchParams();
  const pack = usePackDetails(params.id as string);

  return (
    <>
      <LargeTitleHeader title="Pack Categories" />
      {pack?.categories ? (
        <ScrollView className="flex-1">
          <View className="p-4">
            <Text variant="subhead" className="mb-2 text-muted-foreground">
              Organize your gear by functional categories
            </Text>
          </View>

          <View className="pb-4">
            {pack.categories.map((category: any) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text>The items in this pack aren't categorized.</Text>
        </View>
      )}
    </>
  );
}
