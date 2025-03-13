"use client"

import { useState } from "react"
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Icon } from "@roninoss/icons"
import type { WeightUnit } from "~/types"

export default function AddEditItemScreen({ route, navigation }: any) {
  // For a new item, these would be default values
  // For editing, you would populate from the existing item
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [weight, setWeight] = useState("")
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("g")
  const [quantity, setQuantity] = useState("1")
  const [category, setCategory] = useState("")
  const [consumable, setConsumable] = useState(false)
  const [worn, setWorn] = useState(false)
  const [notes, setNotes] = useState("")
  const [image, setImage] = useState<string | null>(null)

  const isEditing = route?.params?.itemId != null

  const handleSave = () => {
    // Validate and save the item
    if (!name.trim()) {
      // Show error
      return
    }

    const itemData = {
      name,
      description,
      weight: Number.parseFloat(weight) || 0,
      weightUnit,
      quantity: Number.parseInt(quantity) || 1,
      category,
      consumable,
      worn,
      notes,
      image,
    }

    console.log("Saving item:", itemData)
    // In a real app, you would save to your data store
  }

  const handleAddImage = () => {
    // In a real app, you would use expo-image-picker
    setImage("https://placehold.co/400x300/png")
  }

  const handleRemoveImage = () => {
    setImage(null)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => console.log("Go back")} className="mr-3">
            <Icon name="chevron-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900 flex-1">{isEditing ? "Edit Item" : "Add New Item"}</Text>
          <TouchableOpacity onPress={handleSave} className="bg-blue-500 px-4 py-1.5 rounded-lg">
            <Text className="text-white font-medium">Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <View className="p-4">
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1">Name *</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-3 py-2"
                value={name}
                onChangeText={setName}
                placeholder="Item name"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1">Description</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-3 py-2"
                value={description}
                onChangeText={setDescription}
                placeholder="Brief description"
                multiline
              />
            </View>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 font-medium mb-1">Weight *</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2"
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="0.0"
                  keyboardType="numeric"
                />
              </View>

              <View className="w-24">
                <Text className="text-gray-700 font-medium mb-1">Unit</Text>
                <View className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {(["g", "oz", "kg", "lb"] as WeightUnit[]).map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        className={`px-3 py-2 ${weightUnit === unit ? "bg-blue-500" : "bg-white"}`}
                        onPress={() => setWeightUnit(unit)}
                      >
                        <Text className={weightUnit === unit ? "text-white" : "text-gray-700"}>{unit}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View className="w-20 ml-2">
                <Text className="text-gray-700 font-medium mb-1">Qty</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2"
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="1"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1">Category</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-3 py-2"
                value={category}
                onChangeText={setCategory}
                placeholder="e.g., Shelter, Cooking, Clothing"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1">Properties</Text>
              <View className="bg-white border border-gray-300 rounded-lg p-3">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-gray-700">Consumable</Text>
                  <Switch
                    value={consumable}
                    onValueChange={setConsumable}
                    trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                  />
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700">Worn (not carried)</Text>
                  <Switch value={worn} onValueChange={setWorn} trackColor={{ false: "#d1d5db", true: "#3b82f6" }} />
                </View>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1">Image</Text>
              {image ? (
                <View className="relative">
                  <Image source={{ uri: image }} className="w-full h-48 rounded-lg" resizeMode="cover" />
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                    onPress={handleRemoveImage}
                  >
                    <Icon name="close" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  className="bg-white border border-gray-300 border-dashed rounded-lg p-4 items-center justify-center h-48"
                  onPress={handleAddImage}
                >
                  <Icon name="camera" size={32} color="#9ca3af" />
                  <Text className="text-gray-500 mt-2">Tap to add an image</Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1">Notes</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 h-24"
                value={notes}
                onChangeText={setNotes}
                placeholder="Additional notes about this item"
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

