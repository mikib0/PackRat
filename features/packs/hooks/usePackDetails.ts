import { useQuery } from '@tanstack/react-query';
import type { Pack } from '../types';
import axiosInstance, { handleApiError } from '~/lib/api/client';

// API function
export const getPackById = async (id: string): Promise<Pack> => {
  try {
    const response = await axiosInstance.get(`/api/packs/${id}`);
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    console.log(error);
    throw new Error(`Failed to fetch pack: ${message}`);
  }
};

// Hook
export function usePackDetails(id: string) {
  return useQuery({
    queryKey: ['pack', id],
    queryFn: () => getPackById(id),
    enabled: !!id,
  });
}
