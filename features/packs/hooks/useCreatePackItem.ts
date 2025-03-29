import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PackItem, PackItemInput } from '../types';
import axiosInstance, { handleApiError } from '~/lib/api/client';

// API function
export const createPackItem = async (
  packId: string,
  itemData: PackItemInput
): Promise<PackItem> => {
  try {
    console.log(`/api/packs/${packId}/items`);
    const response = await axiosInstance.post(`/api/packs/${packId}/items`, itemData);
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to create pack item: ${message}`);
  }
};

// Hook
export function useCreatePackItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ packId, itemData }: { packId: string; itemData: PackItemInput }) =>
      createPackItem(packId, itemData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['packItems', variables.packId] });
      queryClient.invalidateQueries({ queryKey: ['pack', variables.packId] });
      queryClient.invalidateQueries({ queryKey: ['packs'] });
    },
  });
}
