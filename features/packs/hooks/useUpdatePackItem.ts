import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PackItem, PackItemInput } from '../types';
import axiosInstance, { handleApiError } from '~/lib/api/client';

// API function
export const updatePackItem = async (
  packId: string,
  itemId: string,
  itemData: PackItemInput
): Promise<PackItem> => {
  try {
    const response = await axiosInstance.put(`/api/packs/${packId}/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to update pack item: ${message}`);
  }
};

// Hook
export function useUpdatePackItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      packId,
      itemId,
      itemData,
    }: {
      packId: string;
      itemId: string;
      itemData: PackItemInput;
    }) => updatePackItem(packId, itemId, itemData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['packItems', variables.packId] });
      queryClient.invalidateQueries({ queryKey: ['packItem', variables.itemId, variables.packId] });
      queryClient.invalidateQueries({ queryKey: ['pack', variables.packId] });
      queryClient.invalidateQueries({ queryKey: ['packs'] });
    },
  });
}
