import { Image, Text, View } from "react-native"
import type { User } from "~/types"

type UserAvatarProps = {
  user: User
  size?: "sm" | "md" | "lg"
  showName?: boolean
}

export default function UserAvatar({ user, size = "md", showName = false }: UserAvatarProps) {
  const sizeClass = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }[size]

  const fontClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size]

  return (
    <View className="flex-row items-center">
      <View className={`${sizeClass} rounded-full overflow-hidden bg-gray-200`}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full items-center justify-center bg-blue-500">
            <Text className="text-white font-bold">{user.name.substring(0, 2).toUpperCase()}</Text>
          </View>
        )}
      </View>

      {showName && <Text className={`ml-2 font-medium text-gray-900 ${fontClass}`}>{user.name}</Text>}
    </View>
  )
}

