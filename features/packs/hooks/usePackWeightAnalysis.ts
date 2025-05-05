import { useQuery } from '@tanstack/react-query';
import axiosInstance, { handleApiError } from '~/lib/api/client';

export const getPackWeightAnalysis = async (packId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/api/weight-analysis/${packId}`);
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to load weight analysis: ${message}`);
  }
};

export function usePackWeightAnalysis(packId?: string) {
  return useQuery({
    queryKey: ['pack-weight-analysis', packId],
    queryFn: () => getPackWeightAnalysis(packId!),
    enabled: !!packId, // only run query if packId is defined
  });
}
