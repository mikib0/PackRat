import { useQuery } from '@tanstack/react-query';
import type { Pack } from '../types';
import axiosInstance, { handleApiError } from '~/lib/api/client';

// API function
export const getAllPacks = async (): Promise<Pack[]> => {
  try {
    const response = await axiosInstance.get('/api/packs');
    return response.data;
  } catch (error) {
    console.log(error);
    const { message } = handleApiError(error);
    throw new Error(`Failed to fetch packs: ${message}`);
  }
};

export function usePacks() {
  return useQuery({
    queryKey: ['packs'],
    queryFn: getAllPacks,
  });
}
