'use client';

import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';

import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import { Text } from '~/components/nativewindui/Text';
import { usePackDetails } from '~/features/packs/hooks/usePackDetails';
import { usePackWeightHistory } from '~/features/packs/hooks/usePackWeightHistory';

export default function PackStatsScreen() {
  const params = useLocalSearchParams();
  const packId = params.id;
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const pack = usePackDetails(params.id as string);
  const { data: weightHistory, isLoading: isWeightLoading } = usePackWeightHistory(
    packId as string
  );

  if (pack.isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (pack.isError || !pack?.categories) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Failed to load pack data.</Text>
      </View>
    );
  }

  const CATEGORY_DISTRIBUTION = pack.categories.map((category) => ({
    name: category.name,
    weight: category.weight,
    color: '#888',
    percentage: category.percentage,
  }));

  const WEIGHT_HISTORY =
    weightHistory?.map((entry) => ({
      month: entry.month,
      weight: entry.average_weight,
    })) || [];

  return (
    <View className="flex-1" key={refreshKey}>
      <LargeTitleHeader title="Pack Stats" />
      <ScrollView className="flex-1 px-4">
        {/* Weight History Section */}
        <View className="my-4 rounded-lg bg-card p-4">
          <Text variant="heading" className="mb-12 font-semibold">
            Weight History
          </Text>

          {isWeightLoading ? (
            <ActivityIndicator size="small" className="my-4" />
          ) : (
            <View className="mb-2 h-40 flex-row items-end justify-between">
              {WEIGHT_HISTORY.map((item, index) => {
                const maxWeight = Math.max(...WEIGHT_HISTORY.map((w) => w.weight));
                const minWeight = Math.min(...WEIGHT_HISTORY.map((w) => w.weight));
                const range = maxWeight - minWeight || 1;
                const heightPercentage = ((item.weight - minWeight) / range) * 80 + 20;

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
                      {item.weight.toFixed(1)} g
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <Text variant="footnote" className="mt-2 text-center text-muted-foreground">
            Pack weight over the last 6 months (g)
          </Text>
        </View>

        {/* Category Distribution Section */}
        <View className="my-4 rounded-lg bg-card p-4">
          <Text variant="heading" className="mb-4 font-semibold">
            Category Distribution
          </Text>

          <View className="mb-4">
            {CATEGORY_DISTRIBUTION.map((item, index) => (
              <View key={index} className="mb-2">
                <View className="mb-1 flex-row justify-between">
                  <Text variant="subhead">{item.name}</Text>
                  <Text variant="subhead">
                    {item.weight.value.toFixed(1)} {item.weight.unit}({item.percentage}%)
                  </Text>
                </View>
                <View className="h-2 overflow-hidden rounded-full bg-muted">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>

          <Text variant="footnote" className="mt-2 text-center text-muted-foreground">
            Weight distribution by category
          </Text>
        </View>

        {/* Pack Insights Section */}
        <View className="my-4 mb-8 rounded-lg bg-card p-4">
          <Text variant="heading" className="mb-4 font-semibold">
            Pack Insights
          </Text>

          <View className="mb-3 rounded-md bg-muted p-3 dark:bg-gray-100/5">
            <Text variant="subhead" className="font-medium">
              Your pack is lighter than 78% of similar hikers
            </Text>
            <Text variant="footnote" className="mt-1 text-muted-foreground">
              Based on data from 1,245 Appalachian Trail hikers
            </Text>
          </View>

          <View className="mb-3 rounded-md bg-muted p-3 dark:bg-gray-100/5">
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
    </View>
  );
}
