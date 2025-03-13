import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { currentUser, mockPacks } from "../data/mockData"
import { Icon } from "@roninoss/icons"
import PackCard from "~/components/initial/PackCard"
import UserAvatar from "~/components/initial/UserAvatar"

export default function ProfileScreen({ navigation }: any) {
  const userPacks = mockPacks.filter((pack) => pack.userId === currentUser.id)

  const handlePackPress = (pack: any) => {
    // In a real app, you would navigate to the pack details screen
    console.log("Navigate to pack details:", pack.id)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => console.log("Go back")} className="mr-3">
          <Icon name="chevron-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-900 flex-1">Profile</Text>
        <TouchableOpacity>
          <Icon name="cog-outline" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View className="bg-white p-4 items-center mb-4">
          <UserAvatar user={currentUser} size="lg" />
          <Text className="text-xl font-bold text-gray-900 mt-2">{currentUser.name}</Text>
          <View className="bg-blue-100 px-2 py-1 rounded-full mt-1">
            <Text className="text-blue-800 text-xs font-medium capitalize">{currentUser.experience}</Text>
          </View>

          {currentUser.bio && <Text className="text-gray-600 text-center mt-3">{currentUser.bio}</Text>}

          <Text className="text-gray-500 text-xs mt-3">Member since {formatDate(currentUser.joinedAt)}</Text>

          <TouchableOpacity className="mt-4 bg-blue-500 rounded-lg px-4 py-2">
            <Text className="text-white font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white mb-4">
          <View className="px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">My Packs</Text>
          </View>

          {userPacks.length > 0 ? (
            userPacks.map((pack) => (
              <View key={pack.id} className="px-4 pt-4 last:pb-4">
                <PackCard pack={pack} onPress={handlePackPress} />
              </View>
            ))
          ) : (
            <View className="p-4 items-center">
              <Text className="text-gray-500">No packs created yet</Text>
            </View>
          )}

          <TouchableOpacity className="m-4 bg-blue-500 rounded-lg py-3 items-center">
            <Text className="text-white font-semibold">Create New Pack</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white mb-4">
          <View className="px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">Stats</Text>
          </View>

          <View className="p-4 flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">{userPacks.length}</Text>
              <Text className="text-gray-500">Packs</Text>
            </View>

            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {userPacks.reduce((total, pack) => total + pack.items.length, 0)}
              </Text>
              <Text className="text-gray-500">Items</Text>
            </View>

            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {userPacks.filter((pack) => pack.isPublic).length}
              </Text>
              <Text className="text-gray-500">Public</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

