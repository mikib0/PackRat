import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { handleApiError } from '~/lib/api/client';

// API function
export const deletePackItem = async (packId: string, itemId: string): Promise<void> => {
  try {
    console.log(packId, itemId);
    await axiosInstance.delete(`/api/packs/${packId}/items/${itemId}`);
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to delete pack item: ${message}`);
  }
};

// Hook
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ packId, itemId }: { packId: string; itemId: string }) =>
      deletePackItem(packId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['packItems', variables.packId] });
      queryClient.invalidateQueries({ queryKey: ['pack', variables.packId] });
      queryClient.invalidateQueries({ queryKey: ['packs'] });
      queryClient.removeQueries({ queryKey: ['packItem', variables.itemId, variables.packId] });
    },
  });
}
