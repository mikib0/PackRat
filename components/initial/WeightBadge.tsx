import { Text, View } from "react-native"
import type { WeightUnit } from "~/types"
import { formatWeight } from "~/utils/weight"

type WeightBadgeProps = {
  weight: number
  unit: WeightUnit
  type?: "base" | "total" | "item"
}

export default function WeightBadge({ weight, unit, type = "item" }: WeightBadgeProps) {
  const getColorClass = () => {
    switch (type) {
      case "base":
        return "bg-blue-100 text-blue-800"
      case "total":
        return "bg-purple-100 text-purple-800"
      case "item":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <View className={`rounded-full px-2 py-1 ${getColorClass().split(" ")[0]}`}>
      <Text className={`text-xs font-medium ${getColorClass().split(" ")[1]}`}>{formatWeight(weight, unit)}</Text>
    </View>
  )
}

