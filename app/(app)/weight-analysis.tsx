'use client';
import { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';

import { LargeTitleHeader } from '~/components/nativewindui/LargeTitleHeader';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';

// Mock data for weight analysis
const WEIGHT_BREAKDOWN = {
  baseWeight: '8.2 lbs',
  consumableWeight: '4.2 lbs',
  wornWeight: '2.1 lbs',
  totalWeight: '14.5 lbs',
  categories: [
    {
      name: 'Big Three',
      weight: '3.8 lbs',
      percentage: 26,
      items: [
        { name: 'Tent', weight: '1.8 lbs', notes: 'Ultralight 2-person tent' },
        { name: 'Sleeping Bag', weight: '1.2 lbs', notes: '20°F down quilt' },
        { name: 'Sleeping Pad', weight: '0.8 lbs', notes: 'Inflatable, R-value: 4.2' },
      ],
    },
    {
      name: 'Cooking System',
      weight: '0.9 lbs',
      percentage: 6,
      items: [
        { name: 'Stove', weight: '0.3 lbs', notes: 'Canister stove' },
        { name: 'Pot', weight: '0.4 lbs', notes: 'Titanium, 750ml' },
        { name: 'Utensils', weight: '0.1 lbs', notes: 'Spork and knife' },
        { name: 'Mug', weight: '0.1 lbs', notes: 'Insulated' },
      ],
    },
    {
      name: 'Water System',
      weight: '0.6 lbs',
      percentage: 4,
      items: [
        { name: 'Filter', weight: '0.2 lbs', notes: 'Squeeze type' },
        { name: 'Bottles', weight: '0.4 lbs', notes: '2 x 1L bottles' },
      ],
    },
    {
      name: 'Clothing (Packed)',
      weight: '1.5 lbs',
      percentage: 10,
      items: [
        { name: 'Rain Jacket', weight: '0.4 lbs', notes: 'Waterproof/breathable' },
        { name: 'Puffy Jacket', weight: '0.5 lbs', notes: 'Down insulation' },
        { name: 'Extra Socks', weight: '0.1 lbs', notes: '2 pairs, wool' },
        { name: 'Base Layers', weight: '0.3 lbs', notes: 'Top and bottom' },
        { name: 'Gloves', weight: '0.1 lbs', notes: 'Lightweight fleece' },
        { name: 'Beanie', weight: '0.1 lbs', notes: 'Wool blend' },
      ],
    },
    {
      name: 'Electronics',
      weight: '0.7 lbs',
      percentage: 5,
      items: [
        { name: 'Phone', weight: '0.2 lbs', notes: 'With case' },
        { name: 'Battery Bank', weight: '0.3 lbs', notes: '10,000 mAh' },
        { name: 'Headlamp', weight: '0.1 lbs', notes: 'LED, rechargeable' },
        { name: 'Cables', weight: '0.1 lbs', notes: 'USB-C and adapters' },
      ],
    },
    {
      name: 'First Aid/Emergency',
      weight: '0.4 lbs',
      percentage: 3,
      items: [
        { name: 'First Aid Kit', weight: '0.2 lbs', notes: 'Basic supplies' },
        { name: 'Emergency Shelter', weight: '0.1 lbs', notes: 'Space blanket' },
        { name: 'Repair Kit', weight: '0.1 lbs', notes: 'Tape, patches, etc.' },
      ],
    },
    {
      name: 'Consumables',
      weight: '4.2 lbs',
      percentage: 29,
      items: [
        { name: 'Food (5 days)', weight: '4.0 lbs', notes: '~1.6 lbs/day' },
        { name: 'Fuel', weight: '0.2 lbs', notes: 'Small canister' },
      ],
    },
    {
      name: 'Worn Items',
      weight: '2.1 lbs',
      percentage: 14,
      items: [
        { name: 'Hiking Clothes', weight: '1.0 lbs', notes: 'Shirt, pants, underwear, socks' },
        { name: 'Shoes', weight: '0.8 lbs', notes: 'Trail runners' },
        { name: 'Hat', weight: '0.1 lbs', notes: 'Sun protection' },
        { name: 'Sunglasses', weight: '0.1 lbs', notes: 'With case' },
        { name: 'Watch', weight: '0.1 lbs', notes: 'GPS enabled' },
      ],
    },
  ],
};

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
  const { colors } = useColorScheme();
  const [refreshKey, setRefreshKey] = useState(0);

  // Force a re-render after initial mount to fix layout issues
  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1" key={refreshKey}>
      <LargeTitleHeader title="Weight Analysis" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        removeClippedSubviews={false}>
        <View className="grid grid-cols-2 gap-3 p-4">
          <WeightCard
            title="Base Weight"
            weight={WEIGHT_BREAKDOWN.baseWeight}
            percentage={56}
            className="col-span-1"
          />
          <WeightCard
            title="Consumable"
            weight={WEIGHT_BREAKDOWN.consumableWeight}
            percentage={29}
            className="col-span-1"
          />
          <WeightCard
            title="Worn Weight"
            weight={WEIGHT_BREAKDOWN.wornWeight}
            percentage={14}
            className="col-span-1"
          />
          <WeightCard
            title="Total Weight"
            weight={WEIGHT_BREAKDOWN.totalWeight}
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

        {/* Render each category as a separate card with manual item rendering */}
        {WEIGHT_BREAKDOWN.categories.map((category, categoryIndex) => (
          <View key={category.name} className="mx-4 mb-4 rounded-lg bg-card">
            {/* Category Header */}
            <View className="border-border/25 dark:border-border/80 flex-row items-center justify-between border-b p-4">
              <View>
                <Text variant="heading" className="font-semibold">
                  {category.name}
                </Text>
                <Text variant="subhead" className="text-muted-foreground">
                  {category.weight} • {category.percentage}% of total
                </Text>
              </View>
            </View>

            {/* Category Items - Manually rendered instead of using List */}
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
                    <Text variant="footnote" className="text-muted-foreground">
                      {item.notes}
                    </Text>
                  </View>
                  <Text variant="subhead" className="text-muted-foreground">
                    {item.weight}
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
