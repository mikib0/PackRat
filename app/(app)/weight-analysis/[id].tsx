'use client';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';

import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import { Text } from '~/components/nativewindui/Text';
import { usePackWeightAnalysis } from '~/features/packs/hooks/usePackWeightAnalysis';
import { cn } from '~/lib/cn';

function WeightCard({
  title,
  weight,
  percentage,
  className,
}: {
  title: string;
  weight: string;
  percentage?: number;
  className?: string;
}) {
  return (
    <View className={cn('rounded-lg bg-card p-4', className)}>
      <Text variant="subhead" className="text-muted-foreground">
        {title}
      </Text>
      <Text variant="title2" className="mt-1 font-semibold">
        {weight}
      </Text>
      {percentage && (
        <Text variant="footnote" className="mt-1 text-muted-foreground">
          {percentage}% of total
        </Text>
      )}
    </View>
  );
}

export default function WeightAnalysisScreen() {
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useLocalSearchParams();
  const packId = typeof params.id === 'string' ? parseInt(params.id) : undefined;

  const { data, isLoading, error } = usePackWeightAnalysis(packId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  if (error) return <Text className="p-4 text-red-500">Error loading weight analysis</Text>;
  if (!data) return null;

  return (
    <View className="flex-1" key={refreshKey}>
      <LargeTitleHeader title="Weight Analysis" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        removeClippedSubviews={false}>
        <View className="grid grid-cols-2 gap-3 p-4">
          <WeightCard title="Base Weight" weight={`${data.baseWeight} g`} className="col-span-1" />
          <WeightCard
            title="Consumables Weight"
            weight={`${data.consumableWeight} g`}
            className="col-span-1"
          />
          <WeightCard title="Worn Weight" weight={`${data.wornWeight} g`} className="col-span-1" />
          <WeightCard
            title="Total Weight"
            weight={`${data.totalWeight} g`}
            className="col-span-1"
          />
        </View>

        <View className="mb-4 px-4">
          <Text variant="heading" className="mb-2 font-semibold">
            Weight Breakdown
          </Text>
          <Text variant="subhead" className="mb-4 text-muted-foreground">
            Detailed analysis of your pack weight by category
          </Text>
        </View>

        {data.categories.map((category, categoryIndex) => (
          <View key={category.name} className="mx-4 mb-4 rounded-lg bg-card">
            {/* Category Header */}
            <View className="border-border/25 dark:border-border/80 flex-row items-center justify-between border-b p-4">
              <View>
                <Text variant="heading" className="font-semibold">
                  {category.name}
                </Text>
                <Text variant="subhead" className="text-muted-foreground">
                  {category.weight}
                </Text>
              </View>
            </View>

            {/* Items */}
            <View>
              {category.items.map((item, itemIndex) => (
                <View
                  key={`${categoryIndex}-${itemIndex}`}
                  className={cn(
                    'flex-row items-center justify-between p-4',
                    itemIndex > 0 ? 'border-border/25 dark:border-border/80 border-t' : ''
                  )}>
                  <View>
                    <Text>{item.name}</Text>
                    {item.notes && (
                      <Text variant="footnote" className="text-muted-foreground">
                        {item.notes}
                      </Text>
                    )}
                  </View>
                  <Text variant="subhead" className="text-muted-foreground">
                    {item.weight} {item.weightUnit}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
