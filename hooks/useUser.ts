import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { currentUser } from "../data/mockData"
import type { User } from "../types"

// In a real app, these would be API calls
const fetchCurrentUser = async (): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return currentUser
}

const updateUser = async (user: User): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    ...user,
  }
}

export function useUser() {
  const queryClient = useQueryClient()

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  })

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser)
    },
  })

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error,
    updateUser: updateUserMutation.mutate,
  }
}

