import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { packListAtom } from '~/atoms/packListAtoms';
import { store } from '~/atoms/store';
import type { Pack } from '../types';

// In a real app, these would be API calls
const fetchPacks = async (): Promise<Pack[]> => {
  const packs = store.get(packListAtom);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return packs;
};

const fetchPackById = async (id: string): Promise<Pack | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const packs = store.get(packListAtom);
  return packs.find((pack) => pack.id === id);
};

const createPack = async (pack: Omit<Pack, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pack> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newPack: Pack = {
    ...pack,
    id: `pack-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const packs = store.get(packListAtom);
  store.set(packListAtom, [...packs, newPack]);
  return newPack;
};

const updatePack = async (pack: Pack): Promise<Pack> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const updatedPack = {
    ...pack,
    updatedAt: new Date().toISOString(),
  };
  const packs = store.get(packListAtom);
  store.set(
    packListAtom,
    packs.map((p) => (p.id === pack.id ? updatedPack : p))
  );
  return updatedPack;
};

const deletePack = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const packs = store.get(packListAtom);
  store.set(
    packListAtom,
    packs.filter((pack) => pack.id !== id)
  );
};

export function usePacks() {
  return useQuery({
    queryKey: ['packs'],
    queryFn: fetchPacks,
  });
}

export function usePackDetails(id: string) {
  const fetchPack = async () => fetchPackById(id);

  return useQuery({
    queryKey: ['pack', id],
    queryFn: fetchPack,
    enabled: !!id,
  });
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
