import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAtom } from '~/atoms/authAtoms';
import { store } from '~/atoms/store';
import type { User } from '../types';

// In a real app, these would be API calls
const fetchCurrentUser = async (): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const user = store.get(authAtom);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateUser = async (user: User): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    ...user,
  };
};

export function useUser() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error,
    updateUser: updateUserMutation.mutate,
  };
}
