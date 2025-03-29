import type { PackItem } from "../items/types"

export type PackCategory = "hiking" | "backpacking" | "camping" | "climbing" | "winter" | "desert" | "custom"

export interface Pack {
  id: string
  name: string
  description?: string
  category: PackCategory
  userId: string
  isPublic: boolean
  image?: string
  tags?: string[]
  items: PackItem[]
  baseWeight?: number
  totalWeight?: number
  createdAt: string
  updatedAt: string
}

export interface PackInput {
  name: string
  description?: string
  category: PackCategory
  isPublic?: boolean
  image?: string
  tags?: string[]
}

