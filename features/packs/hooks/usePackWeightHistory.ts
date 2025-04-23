import { useQuery } from '@tanstack/react-query';

import axiosInstance, { handleApiError } from '~/lib/api/client';

export type PackMonthlyAverage = {
  month: string;
  average_weight: number;
};

export const getPackWeightHistory = async (packId: number): Promise<PackMonthlyAverage[]> => {
  try {
    const response = await axiosInstance.get(`/api/weight-history/${packId}`);
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to load pack weight averages: ${message}`);
  }
};

export function usePackWeightHistory(packId?: number) {
  return useQuery({
    queryKey: ['pack-weight-history', packId],
    queryFn: () => getPackWeightHistory(packId!),
    enabled: !!packId,
  });
}
