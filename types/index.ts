export type User = {
  id: string
  name: string
  email: string
  avatar: string
  experience: "beginner" | "intermediate" | "expert"
  joinedAt: string
  bio?: string
}

export type PackCategory = "hiking" | "backpacking" | "camping" | "climbing" | "winter" | "desert" | "custom"

export type WeightUnit = "g" | "oz" | "kg" | "lb"

export type PackItem = {
  id: string
  name: string
  description?: string
  weight: number
  weightUnit: WeightUnit
  quantity: number
  category: string
  consumable: boolean
  worn: boolean
  image?: string
  notes?: string
  packId: string
  createdAt: string
  updatedAt: string
}

export type Pack = {
  id: string
  name: string
  description?: string
  category: PackCategory
  baseWeight?: number // Weight without consumables
  totalWeight?: number // Total weight with consumables
  items: PackItem[]
  userId: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  image?: string
  tags?: string[]
}

