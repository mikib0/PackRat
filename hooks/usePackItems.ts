import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { mockPackItems } from "../data/mockData"
import type { PackItem } from "../types"

// In a real app, these would be API calls
const fetchPackItems = async (packId: string): Promise<PackItem[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockPackItems.filter((item) => item.packId === packId)
}

const fetchItemById = async (id: string): Promise<PackItem | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockPackItems.find((item) => item.id === id)
}

const createItem = async (item: Omit<PackItem, "id" | "createdAt" | "updatedAt">): Promise<PackItem> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newItem: PackItem = {
    ...item,
    id: `item-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return newItem
}

const updateItem = async (item: PackItem): Promise<PackItem> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    ...item,
    updatedAt: new Date().toISOString(),
  }
}

const deleteItem = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  // In a real app, you would delete from your API
}

export function usePackItems(packId: string) {
  const queryClient = useQueryClient()

  const itemsQuery = useQuery({
    queryKey: ["packItems", packId],
    queryFn: () => fetchPackItems(packId),
    enabled: !!packId,
  })

  const createItemMutation = useMutation({
    mutationFn: createItem,
    onSuccess: (newItem) => {
      queryClient.setQueryData(["packItems", packId], (old: PackItem[] = []) => [...old, newItem])

      // Update the pack's items count in the pack query
      queryClient.setQueryData(["pack", packId], (oldPack: any) => {
        if (!oldPack) return oldPack
        return {
          ...oldPack,
          items: [...(oldPack.items || []), newItem],
        }
      })
    },
  })

  const updateItemMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(["packItems", packId], (old: PackItem[] = []) =>
        old.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      )
      queryClient.setQueryData(["packItem", updatedItem.id], updatedItem)

      // Update the item in the pack query
      queryClient.setQueryData(["pack", packId], (oldPack: any) => {
        if (!oldPack) return oldPack
        return {
          ...oldPack,
          items: oldPack.items.map((item: PackItem) => (item.id === updatedItem.id ? updatedItem : item)),
        }
      })
    },
  })

  const deleteItemMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["packItems", packId], (old: PackItem[] = []) => old.filter((item) => item.id !== id))
      queryClient.removeQueries({ queryKey: ["packItem", id] })

      // Remove the item from the pack query
      queryClient.setQueryData(["pack", packId], (oldPack: any) => {
        if (!oldPack) return oldPack
        return {
          ...oldPack,
          items: oldPack.items.filter((item: PackItem) => item.id !== id),
        }
      })
    },
  })

  return {
    items: itemsQuery.data || [],
    isLoading: itemsQuery.isLoading,
    isError: itemsQuery.isError,
    error: itemsQuery.error,
    createItem: createItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
  }
}

export function usePackItemDetails(id: string) {
  const fetchItem = async () => fetchItemById(id)

  const itemQuery = useQuery({
    queryKey: ["packItem", id],
    queryFn: fetchItem,
    enabled: !!id,
  })

  return {
    item: itemQuery.data,
    isLoading: itemQuery.isLoading,
    isError: itemQuery.isError,
    error: itemQuery.error,
  }
}

