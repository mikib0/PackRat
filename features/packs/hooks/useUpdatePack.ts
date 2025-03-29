import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Pack, PackInput } from "../types"
import axios from "axios"
import { handleApiError } from "~/lib/api/client"

// API function
export const updatePack = async (id: string, packData: PackInput): Promise<Pack> => {
  try {
    const response = await axios.put(`/api/packs/${id}`, packData)
    return response.data
  } catch (error) {
    const { message } = handleApiError(error)
    throw new Error(`Failed to update pack: ${message}`)
  }
}

// Hook
export function useUpdatePack() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: PackInput & { id: string }) => updatePack(id, data),
    onSuccess: (updatedPack) => {
      queryClient.invalidateQueries({ queryKey: ["packs"] })
      queryClient.invalidateQueries({ queryKey: ["pack", updatedPack.id] })
    },
  })
}

