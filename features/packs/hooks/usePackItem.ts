import { useQuery } from '@tanstack/react-query';
import type { PackItem } from '../types';
import axiosInstance, { handleApiError } from '~/lib/api/client';

// API function
export const getPackItem = async (packId: string, itemId: string): Promise<PackItem> => {
  try {
    const response = await axiosInstance.get(`/api/packs/${packId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to fetch pack item: ${message}`);
  }
};

// Hook
export function usePackItem(itemId: string | undefined, packId: string | undefined) {
  return useQuery({
    queryKey: ['packItem', itemId, packId],
    queryFn: () => getPackItem(packId as string, itemId as string),
    enabled: !!itemId && !!packId,
  });
}
