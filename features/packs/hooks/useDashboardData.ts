import { useQuery } from '@tanstack/react-query';

import axiosInstance, { handleApiError } from '~/lib/api/client';

export const getDashboardData = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/dashboard');
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to load dashboard: ${message}`);
  }
};

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  });
}
