import { Icon } from "@roninoss/icons"
import { router } from "expo-router"
import { Pressable, View } from "react-native"

import { Text } from "~/components/nativewindui/Text"
import { cn } from "~/lib/cn"
import { useColorScheme } from "~/lib/useColorScheme"
import { useActiveLocation } from "../hooks"
import { WeatherIcon } from './WeatherIcon';
import { isAuthed } from '~/features/auth/store';

export function WeatherWidget() {
  const { activeLocation } = useActiveLocation();
  const { colors } = useColorScheme();

  if (!activeLocation) {
    return (
      <View className="mx-4 mb-4">
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-xs font-medium uppercase text-muted-foreground">
            Location & Weather
          </Text>
        </View>

        <Pressable
          onPress={() => {
            if (!isAuthed.peek()) {
              return router.push({
                pathname: '/auth',
                params: {
                  redirectTo: '/locations',
                  showSignInCopy: 'true',
                },
              });
            }
            router.push('/locations');
          }}
          className="active:opacity-80">
          {({ pressed }) => (
            <View
              className={cn(
                'bg-muted/30 overflow-hidden rounded-xl border border-border',
                pressed ? 'opacity-90' : 'opacity-100'
              )}>
              <View className="items-center justify-center p-6">
                {/* <Icon
                  name="map-marker-radius-outline"
                  size={32}
                  color={colors.grey2}
                  className="mb-2"
                /> */}
                <WeatherIcon
                  condition="partly cloudy"
                  size={32}
                  color={colors.grey2}
                  className="mb-2"
                />
                <Text className="text-center font-medium">
                  Add a location to see weather updates
                </Text>
                <Text className="text-center text-sm text-muted-foreground">
                  Location data helps PackRat AI provide better advice
                </Text>
              </View>

              <View className="bg-primary/10 flex-row items-center justify-between px-3 py-1.5">
                <Text className="text-xs text-primary">Tap to add a location</Text>
                <Icon name="arrow-right" size={14} color={colors.primary} />
              </View>
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View className="mx-4 mb-4">
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="text-xs font-medium uppercase text-muted-foreground">Current Weather</Text>
        <Pressable onPress={() => router.push('/locations')}>
          <Text className="text-xs text-primary">View All Locations</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => router.push(`/locations/${activeLocation.id}`)}
        className="active:opacity-80">
        {({ pressed }) => (
          <View
            className={cn(
              'overflow-hidden rounded-xl bg-blue-500',
              pressed ? 'opacity-90' : 'opacity-100'
            )}>
            <View className="flex-row justify-between p-3">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="font-semibold text-white">{activeLocation.name}</Text>
                  <Icon name="chevron-right" size={16} color="white" className="ml-1 opacity-80" />
                </View>
                <Text className="text-xs text-white/80">{activeLocation.time}</Text>
                <Text className="mt-1 text-white">{activeLocation.condition}</Text>
              </View>

              <View className="flex-row items-center">
                <WeatherIcon
                  condition={activeLocation.condition}
                  code={activeLocation.details?.weatherCode}
                  isDay={activeLocation.details?.isDay}
                  size={32}
                  color="white"
                  className="mr-2 opacity-90"
                />
                <View className="items-end">
                  <Text className="text-3xl text-white">{activeLocation.temperature}°</Text>
                  <Text className="text-xs text-white/80">
                    H:{activeLocation.highTemp}° L:{activeLocation.lowTemp}°
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between bg-blue-600 px-3 py-1.5">
              <Text className="text-xs text-white/90">Tap for detailed forecast</Text>
              <Icon name="arrow-right" size={14} color="white" />
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
}

