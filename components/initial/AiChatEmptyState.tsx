import { Icon } from "@roninoss/icons"
import { Pressable, ScrollView, View } from "react-native"
import { Text } from "~/components/nativewindui/Text"
import { cn } from "~/lib/cn"
import { useColorScheme } from "~/lib/useColorScheme"

type ConversationStarter = {
  icon: string
  text: string
  onPress: () => void
}

type EmptyStateProps = {
  onSelectStarter: (text: string) => void
}

export function AIChatEmptyState({ onSelectStarter }: EmptyStateProps) {
  const { colors } = useColorScheme()

  const conversationStarters: ConversationStarter[] = [
    {
      icon: "backpack",
      text: "What should I pack for a 3-day hike?",
      onPress: () => onSelectStarter("What should I pack for a 3-day hike?"),
    },
    {
      icon: "map",
      text: "Recommend lightweight gear for beginners",
      onPress: () => onSelectStarter("Recommend lightweight gear for beginners"),
    },
    {
      icon: "compass",
      text: "How do I reduce my pack weight?",
      onPress: () => onSelectStarter("How do I reduce my pack weight?"),
    },
    {
      icon: "tent",
      text: "What's the best ultralight tent?",
      onPress: () => onSelectStarter("What's the best ultralight tent?"),
    },
    {
      icon: "boot",
      text: "Help me plan a weekend backpacking trip",
      onPress: () => onSelectStarter("Help me plan a weekend backpacking trip"),
    },
    {
      icon: "water",
      text: "How much water should I carry?",
      onPress: () => onSelectStarter("How much water should I carry?"),
    },
  ]

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 pt-10">
      <View className="items-center justify-center mb-8">
        <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-4">
          <Icon name="backpack" size={40} color={colors.primary} />
        </View>
        <Text variant="title2" className="text-center mb-1">
          Welcome to PackRat AI
        </Text>
        <Text variant="body" className="text-center text-muted-foreground mb-6 px-6">
          Your personal hiking assistant. Ask me anything about gear, trails, or planning your next adventure.
        </Text>
      </View>

      <Text variant="subhead" className="mb-4 px-2 text-center">
        Try asking about
      </Text>

      <View className="flex gap-2">
        {conversationStarters.map((starter, index) => (
          <StarterButton key={index} icon={starter.icon} text={starter.text} onPress={starter.onPress} />
        ))}
      </View>
    </ScrollView>
  )
}

function StarterButton({ icon, text, onPress }: ConversationStarter) {
  const { colors } = useColorScheme()

  return (
    <Pressable
      onPress={onPress}
      className={cn("flex-row items-center p-3.5 rounded-2xl border border-border", "active:bg-muted/50")}
      style={{ borderCurve: "continuous" }}
    >
      <View className="mr-3 h-8 w-8 items-center justify-center">
        <Icon name={icon} size={22} color={colors.primary} />
      </View>
      <Text variant="body" className="flex-1">
        {text}
      </Text>
      <Icon name="arrow-up-right" size={18} color={colors.foreground} />
    </Pressable>
  )
}

