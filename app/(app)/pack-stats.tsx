import { View, ScrollView } from 'react-native';

import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

// Mock data for pack stats
const WEIGHT_HISTORY = [
  { month: 'Jan', weight: 14.2 },
  { month: 'Feb', weight: 13.8 },
  { month: 'Mar', weight: 13.1 },
  { month: 'Apr', weight: 12.7 },
  { month: 'May', weight: 12.4 },
  { month: 'Jun', weight: 12.4 },
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Shelter', weight: 2.3, color: '#FF6384', percentage: 28 },
  { name: 'Sleep', weight: 1.8, color: '#36A2EB', percentage: 22 },
  { name: 'Cooking', weight: 0.9, color: '#FFCE56', percentage: 11 },
  { name: 'Water', weight: 0.6, color: '#4BC0C0', percentage: 7 },
  { name: 'Clothing', weight: 1.5, color: '#9966FF', percentage: 18 },
  { name: 'Electronics', weight: 0.7, color: '#FF9F40', percentage: 9 },
  { name: 'First Aid', weight: 0.4, color: '#C9CBCF', percentage: 5 },
];

export default function PackStatsScreen() {
  const { colors } = useColorScheme();

  return (
    <>
      <LargeTitleHeader title="Pack Stats" />
      <ScrollView className="flex-1 px-4">
        <View className="my-4 rounded-lg bg-card p-4">
          <Text variant="heading" className="mb-12 font-semibold">
            Weight History
          </Text>

          {/* Simple weight history visualization */}
          <View className="mb-2 h-40 flex-row items-end justify-between">
            {WEIGHT_HISTORY.map((item, index) => {
              // Calculate height percentage (max height for highest weight)
              const maxWeight = Math.max(...WEIGHT_HISTORY.map((w) => w.weight));
              const minWeight = Math.min(...WEIGHT_HISTORY.map((w) => w.weight));
              const range = maxWeight - minWeight;
              const heightPercentage = ((item.weight - minWeight) / range) * 80 + 20; // 20% minimum height

              return (
                <View key={index} className="flex-1 items-center">
                  <View
                    className="w-6 rounded-t-md bg-primary"
                    style={{ height: `${heightPercentage}%` }}
                  />
                  <Text variant="caption2" className="mt-1">
                    {item.month}
                  </Text>
                  <Text variant="caption2" className="text-muted-foreground">
                    {item.weight}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text variant="footnote" className="mt-2 text-center text-muted-foreground">
            Pack weight over the last 6 months (lbs)
          </Text>
        </View>

        <View className="my-4 rounded-lg bg-card p-4">
          <Text variant="heading" className="mb-4 font-semibold">
            Category Distribution
          </Text>

          {/* Simple category distribution visualization */}
          <View className="mb-4">
            {CATEGORY_DISTRIBUTION.map((item, index) => (
              <View key={index} className="mb-2">
                <View className="mb-1 flex-row justify-between">
                  <Text variant="subhead">{item.name}</Text>
                  <Text variant="subhead">
                    {item.weight} lbs ({item.percentage}%)
                  </Text>
                </View>
                <View className="h-2 overflow-hidden rounded-full bg-muted">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </View>
              </View>
            ))}
          </View>

          <Text variant="footnote" className="mt-2 text-center text-muted-foreground">
            Weight distribution by category (lbs)
          </Text>
        </View>

        <View className="my-4 mb-8 rounded-lg bg-card p-4">
          <Text variant="heading" className="mb-4 font-semibold">
            Pack Insights
          </Text>
          <View className="mb-3 rounded-md bg-muted p-3 dark:bg-gray-100/5">
            {/* bg-gray-50/10 also works well above bg-card with dark mode */}
            <Text variant="subhead" className="font-medium">
              Your pack is lighter than 78% of similar hikers
            </Text>
            <Text variant="footnote" className="mt-1 text-muted-foreground">
              Based on data from 1,245 Appalachian Trail hikers
            </Text>
          </View>
          <View className="mb-3 rounded-md bg-muted p-3  dark:bg-gray-100/5">
            <Text variant="subhead" className="font-medium">
              You've reduced your pack weight by 12% this year
            </Text>
            <Text variant="footnote" className="mt-1 text-muted-foreground">
              From 14.2 lbs in January to 12.4 lbs now
            </Text>
          </View>
          <View className="rounded-md bg-muted p-3 dark:bg-gray-100/5">
            <Text variant="subhead" className="font-medium">
              Your heaviest category is Shelter (18.5% of total)
            </Text>
            <Text variant="footnote" className="mt-1 text-muted-foreground">
              Consider ultralight alternatives to reduce weight
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
