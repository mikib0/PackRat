import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { handleApiError } from "~/lib/api/client"

// API function
export const deletePack = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/packs/${id}`)
  } catch (error) {
    const { message } = handleApiError(error)
    throw new Error(`Failed to delete pack: ${message}`)
  }
}

// Hook
export function useDeletePack() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePack,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["packs"] })
      queryClient.removeQueries({ queryKey: ["pack", id] })
    },
  })
}

