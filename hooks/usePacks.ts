import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { packListAtom } from '~/atoms/packListAtoms';
import { store } from '~/atoms/store';
import { computePackWeights, computePacksWeights } from '~/lib/utils/compute-pack';
import type { Pack } from '../types';

// In a real app, these would be API calls
const fetchPacks = async (): Promise<Pack[]> => {
  const packs = store.get(packListAtom);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Compute weights for all packs before returning
  return computePacksWeights(packs);
};

const fetchPackById = async (id: string): Promise<Pack | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const packs = store.get(packListAtom);
  const pack = packs.find((pack) => pack.id === id);

  // If pack exists, compute its weights before returning
  return pack ? computePackWeights(pack) : undefined;
};

const createPack = async (pack: Omit<Pack, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pack> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Create new pack with default values
  const newPack: Pack = {
    ...pack,
    id: `pack-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Ensure items array exists
    items: pack.items || [],
  };

  // Compute weights for the new pack
  const computedPack = computePackWeights(newPack);

  // Save to store
  const packs = store.get(packListAtom);
  store.set(packListAtom, [...packs, computedPack]);

  return computedPack;
};

const updatePack = async (pack: Pack): Promise<Pack> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Update timestamp
  const updatedPack = {
    ...pack,
    updatedAt: new Date().toISOString(),
  };

  // Compute weights for the updated pack
  const computedPack = computePackWeights(updatedPack);

  // Save to store
  const packs = store.get(packListAtom);
  store.set(
    packListAtom,
    packs.map((p) => (p.id === pack.id ? computedPack : p))
  );

  return computedPack;
};

// Add a function to add/update items in a pack
const updatePackItems = async (packId: string, items: Pack['items']): Promise<Pack> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Get current packs
  const packs = store.get(packListAtom);
  const packIndex = packs.findIndex((p) => p.id === packId);

  if (packIndex === -1) {
    throw new Error(`Pack with ID ${packId} not found`);
  }

  // Update the pack with new items
  const updatedPack = {
    ...packs[packIndex],
    items,
    updatedAt: new Date().toISOString(),
  };

  // Compute weights
  const computedPack = computePackWeights(updatedPack);

  // Save to store
  const updatedPacks = [...packs];
  updatedPacks[packIndex] = computedPack;
  store.set(packListAtom, updatedPacks);

  return computedPack;
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

export function useUpdatePackItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ packId, items }: { packId: string; items: Pack['items'] }) =>
      updatePackItems(packId, items),
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
