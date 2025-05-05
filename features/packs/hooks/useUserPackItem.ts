import { useQuery } from '@tanstack/react-query';

import { PackItem } from '../types';

import axiosInstance, { handleApiError } from '~/lib/api/client';

export const getUserPackItems = async (): Promise<PackItem[]> => {
  try {
    const response = await axiosInstance.get('/api/user/items');
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to fetch user pack items: ${message}`);
  }
};

export function useUserPackItems() {
  return useQuery({
    queryKey: ['userPackItems'],
    queryFn: getUserPackItems,
  });
}
