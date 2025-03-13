import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockPacks } from '../data/mockData';
import type { Pack } from '../types';

// In a real app, these would be API calls
const fetchPacks = async (): Promise<Pack[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockPacks;
};

const fetchPackById = async (id: string): Promise<Pack | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockPacks.find((pack) => pack.id === id);
};

const createPack = async (pack: Omit<Pack, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pack> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newPack: Pack = {
    ...pack,
    id: `pack-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newPack;
};

const updatePack = async (pack: Pack): Promise<Pack> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    ...pack,
    updatedAt: new Date().toISOString(),
  };
};

const deletePack = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, you would delete from your API
};

export function usePacks() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['packs'],
    queryFn: fetchPacks,
  });
}

export function usePackDetails(id: string) {
  const fetchPack = async () => fetchPackById(id);

  const packQuery = useQuery({
    queryKey: ['pack', id],
    queryFn: fetchPack,
    enabled: !!id,
  });

  return {
    pack: packQuery.data,
    isLoading: packQuery.isLoading,
    isError: packQuery.isError,
    error: packQuery.error,
  };
}

export function useCreatePack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPack,
    onSuccess: (newPack) => {
      queryClient.setQueryData(['packs'], (old: Pack[] = []) => [...old, newPack]);
    },
  });
}

export function useUpdatePack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePack,
    onSuccess: (updatedPack) => {
      queryClient.setQueryData(['packs'], (old: Pack[] = []) =>
        old.map((pack) => (pack.id === updatedPack.id ? updatedPack : pack))
      );
      queryClient.setQueryData(['pack', updatedPack.id], updatedPack);
    },
  });
}

export function useDeletePack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePack,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['packs'], (old: Pack[] = []) =>
        old.filter((pack) => pack.id !== id)
      );
      queryClient.removeQueries({ queryKey: ['pack', id] });
    },
  });
}
