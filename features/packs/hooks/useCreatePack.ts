import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Pack, PackInput } from "../types"
import axios from "axios"
import { handleApiError } from "~/lib/api/client"

// API function
export const createPack = async (packData: PackInput): Promise<Pack> => {
  try {
    const response = await axios.post("/api/packs", packData)
    return response.data
  } catch (error) {
    const { message } = handleApiError(error)
    throw new Error(`Failed to create pack: ${message}`)
  }
}

// Hook
export function useCreatePack() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (packData: PackInput) => createPack(packData),
    onSuccess: (newPack) => {
      queryClient.invalidateQueries({ queryKey: ["packs"] })
    },
  })
}

