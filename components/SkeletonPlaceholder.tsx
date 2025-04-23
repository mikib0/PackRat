import { ScrollView, View, Text } from 'react-native';

import { LargeTitleHeader } from './nativewindui/LargeTitleHeader';

import { cn } from '~/lib/cn';

export function DashboardSkeleton() {
  return (
    <>
      <View className=" mb-4 h-1/5 rounded-lg bg-gray-300/30 px-4 py-2 dark:bg-gray-700/20" />

      {[...Array(6)].map((_, index) => (
        <View
          key={index}
          className={cn(
            'flex-row items-center gap-4 px-4 py-3',
            index !== 5 && 'mb-8',
            index === 0 && 'ios:border-t-0 border-t',
            'border-border/25 dark:border-border/80'
          )}>
          <View className="h-10 w-10 rounded-md bg-gray-300/40 dark:bg-gray-700/30" />
          <View className="flex-1">
            <View className="mb-2 h-4 w-1/2 rounded bg-gray-300/40 dark:bg-gray-700/30" />
            <View className="h-3 w-1/3 rounded bg-gray-200/40 dark:bg-gray-700/20" />
          </View>
        </View>
      ))}
    </>
  );
}

export function CurrentPackSkeleton() {
  return (
    <View className="flex-1">
      <LargeTitleHeader title="Current Pack" />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="flex-row items-center p-4">
          <View className="mr-4 h-16 w-16 rounded-full bg-gray-300/40 dark:bg-gray-700/30" />
          <View className="flex-1">
            <View className="mb-2 h-6 w-2/3 rounded bg-gray-300/50 dark:bg-gray-700/30" />
            <View className="h-4 w-1/2 rounded bg-gray-200/40 dark:bg-gray-600/30" />
          </View>
        </View>

        <View className="mb-4 flex-row gap-3 px-4">
          {[...Array(2)].map((_, i) => (
            <View
              key={i}
              className="flex-1 space-y-2 rounded-lg bg-card bg-gray-100/40 p-4 dark:bg-gray-800/30">
              <View className="h-4 w-1/2 rounded bg-gray-300/40 dark:bg-gray-700/30" />
              <View className="h-6 w-2/3 rounded bg-gray-300/50 dark:bg-gray-700/30" />
            </View>
          ))}
        </View>

        <View className="mx-4 mb-6 rounded-lg bg-card">
          <View className="border-border/25 dark:border-border/80 border-b p-4">
            <View className="h-5 w-1/3 rounded bg-gray-300/40 dark:bg-gray-700/30" />
          </View>

          {[...Array(3)].map((_, index) => (
            <View
              key={index}
              className={cn(
                'flex-row items-center justify-between p-4',
                index > 0 ? 'border-border/25 dark:border-border/80 border-t' : ''
              )}>
              <View>
                <View className="mb-2 h-4 w-24 rounded bg-gray-300/30 dark:bg-gray-600/30" />
                <View className="h-3 w-40 rounded bg-gray-200/30 dark:bg-gray-700/20" />
              </View>
              <View className="h-6 w-6 rounded-full bg-gray-300/40 dark:bg-gray-700/20" />
            </View>
          ))}
        </View>

        {/* Items Skeleton */}
        <View className="mx-4 mb-8 mt-4 rounded-lg bg-card">
          <View className="border-border/25 dark:border-border/80 border-b p-4">
            <View className="h-5 w-1/3 rounded bg-gray-300/40 dark:bg-gray-700/30" />
          </View>

          {[...Array(4)].map((_, index) => (
            <View
              key={index}
              className={cn(
                'flex-row items-center justify-between p-4',
                index > 0 ? 'border-border/25 dark:border-border/80 border-t' : ''
              )}>
              <View>
                <View className="mb-2 h-4 w-24 rounded bg-gray-300/30 dark:bg-gray-600/30" />
                <View className="h-3 w-20 rounded bg-gray-200/30 dark:bg-gray-700/20" />
              </View>
              <View className="h-5 w-12 rounded bg-gray-300/30 dark:bg-gray-600/30" />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export function RecentPacksSkeleton() {
  return (
    <>
      <LargeTitleHeader title="Recent Packs" />
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text variant="subhead" className="mb-2 text-muted-foreground">
            Loading your recently used packs...
          </Text>
        </View>

        <View className="pb-4">
          {[...Array(3)].map((_, index) => (
            <View
              key={index}
              className={`mx-4 mb-3 overflow-hidden rounded-xl bg-card shadow-sm ${
                index === 0 ? 'mt-4' : ''
              }`}>
              <View className="h-40 w-full bg-gray-300/40 dark:bg-gray-700/30" />
              <View className="p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="mb-2 h-5 w-2/3 rounded bg-gray-300/50 dark:bg-gray-700/30" />
                    <View className="h-4 w-1/2 rounded bg-gray-200/40 dark:bg-gray-600/30" />
                  </View>
                  <View className="items-end">
                    <View className="mb-2 h-4 w-16 rounded bg-gray-300/40 dark:bg-gray-600/30" />
                    <View className="h-3 w-20 rounded bg-gray-200/30 dark:bg-gray-700/20" />
                  </View>
                </View>

                <View className="mt-4 flex-row items-center">
                  <View className="mr-2 h-3 w-3 rounded-full bg-gray-400/40 dark:bg-gray-600/30" />
                  <View className="h-3 w-1/2 rounded bg-gray-300/40 dark:bg-gray-700/30" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

export function WeightAnalysisSkeleton() {
  return (
    <View className="flex-1">
      <LargeTitleHeader title="Weight Analysis" />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="grid grid-cols-2 gap-3 p-4">
          {[...Array(4)].map((_, i) => (
            <View key={i} className="space-y-2 rounded-lg bg-gray-300/30 p-4 dark:bg-gray-700/20">
              <View className="h-4 w-2/3 rounded bg-gray-300/40 dark:bg-gray-600/30" />
              <View className="h-6 w-1/2 rounded bg-gray-200/40 dark:bg-gray-700/30" />
              <View className="h-3 w-1/3 rounded bg-gray-200/30 dark:bg-gray-600/20" />
            </View>
          ))}
        </View>

        <View className="mb-4 px-4">
          <View className="mb-2 h-6 w-1/3 rounded bg-gray-300/40 dark:bg-gray-600/30" />
          <View className="h-4 w-2/3 rounded bg-gray-200/30 dark:bg-gray-700/20" />
        </View>

        {[...Array(2)].map((_, categoryIndex) => (
          <View key={categoryIndex} className="mx-4 mb-4 rounded-lg bg-card">
            <View className="border-border/25 dark:border-border/80 border-b p-4">
              <View className="mb-1 h-5 w-1/3 rounded bg-gray-300/40 dark:bg-gray-600/30" />
              <View className="h-4 w-1/4 rounded bg-gray-200/30 dark:bg-gray-700/20" />
            </View>

            {[...Array(3)].map((_, itemIndex) => (
              <View
                key={itemIndex}
                className={cn(
                  'flex-row items-center justify-between p-4',
                  itemIndex > 0 ? 'border-border/25 dark:border-border/80 border-t' : ''
                )}>
                <View>
                  <View className="mb-1 h-4 w-24 rounded bg-gray-300/30 dark:bg-gray-600/30" />
                  <View className="h-3 w-40 rounded bg-gray-200/30 dark:bg-gray-700/20" />
                </View>
                <View className="h-4 w-12 rounded bg-gray-300/30 dark:bg-gray-600/30" />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export function PackCategoriesSkeleton() {
  return (
    <>
      <LargeTitleHeader title="Pack Categories" />
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="mb-2 h-4 w-3/5 rounded bg-gray-300/40 dark:bg-gray-700/30" />
        </View>

        <View className="pb-4">
          {[...Array(4)].map((_, i) => (
            <View
              key={i}
              className="mx-4 mb-3 overflow-hidden rounded-xl bg-card bg-gray-100/40 shadow-sm dark:bg-gray-800/30">
              <View className="flex-row items-center p-4">
                <View className="h-12 w-12 rounded-md bg-gray-300/40 dark:bg-gray-700/30" />

                <View className="ml-4 flex-1 space-y-2">
                  <View className="h-5 w-1/2 rounded bg-gray-300/50 dark:bg-gray-600/30" />
                  <View className="flex-row justify-between">
                    <View className="h-3 w-1/4 rounded bg-gray-200/40 dark:bg-gray-700/20" />
                    <View className="h-3 w-1/3 rounded bg-gray-200/40 dark:bg-gray-700/20" />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

export function PackStatsSkeleton() {
  return (
    <View className="flex-1">
      <LargeTitleHeader title="Pack Stats" />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Weight History Section */}
        <View className="my-4 rounded-lg bg-card p-4">
          <Text variant="heading" className="mb-12 font-semibold">
            Weight History
          </Text>

          <View className="mb-2 h-40 flex-row items-end justify-between">
            {[...Array(6)].map((_, index) => (
              <View key={index} className="flex-1 items-center">
                <View
                  className="w-6 rounded-t-md bg-gray-300/40 dark:bg-gray-700/30"
                  style={{ height: '20%' }}
                />
                <Text
                  variant="caption2"
                  className="mt-1 h-3 w-10 rounded bg-gray-300/40 dark:bg-gray-700/30"
                />
                <Text
                  variant="caption2"
                  className="mt-1 h-3 w-12 rounded bg-gray-300/40 text-muted-foreground dark:bg-gray-700/30"
                />
              </View>
            ))}
          </View>

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
            {[...Array(5)].map((_, index) => (
              <View key={index} className="mb-2">
                <View className="mb-1 flex-row justify-between">
                  <Text
                    variant="subhead"
                    className="h-4 w-1/3 rounded bg-gray-300/40 dark:bg-gray-700/30"
                  />
                  <Text
                    variant="subhead"
                    className="h-4 w-1/3 rounded bg-gray-300/40 dark:bg-gray-700/30"
                  />
                </View>
                <View className="h-2 overflow-hidden rounded-full bg-muted">
                  <View className="h-full rounded-full bg-gray-300/40 dark:bg-gray-700/30" />
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

          {[...Array(3)].map((_, index) => (
            <View key={index} className="mb-3 rounded-md bg-muted p-3 dark:bg-gray-100/5">
              <Text
                variant="subhead"
                className="h-4 w-2/3 rounded bg-gray-300/40 font-medium dark:bg-gray-700/30"
              />
              <Text
                variant="footnote"
                className="mt-1 h-3 w-1/2 rounded bg-gray-300/40 text-muted-foreground dark:bg-gray-700/30"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
