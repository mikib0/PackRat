import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { packListAtom } from '~/atoms/packListAtoms';
import { store } from '~/atoms/store';
import { computePackWeights } from '~/lib/utils/compute-pack';
import type { Pack, PackItem } from '~/types';

// Helper function to get items for a specific pack
const getPackItems = (packId: string): PackItem[] => {
  const packs = store.get(packListAtom);
  const pack = packs.find((p) => p.id === packId);
  return pack?.items || [];
};

// Helper function to update a pack in the store
const updatePackInStore = (updatedPack: Pack): void => {
  const packs = store.get(packListAtom);
  store.set(
    packListAtom,
    packs.map((p) => (p.id === updatedPack.id ? updatedPack : p))
  );
};

// In a real app, these would be API calls
const fetchPackItems = async (packId: string): Promise<PackItem[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return getPackItems(packId);
};

const fetchItemById = async (id: string, packId: string): Promise<PackItem | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const items = getPackItems(packId);
  return items.find((item) => item.id === id);
};

const createItem = async (
  item: Omit<PackItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ item: PackItem; pack: Pack }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Create the new item
  const newItem: PackItem = {
    ...item,
    id: `item-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Get the current pack
  const packs = store.get(packListAtom);
  const packIndex = packs.findIndex((p) => p.id === item.packId);

  if (packIndex === -1) {
    throw new Error(`Pack with ID ${item.packId} not found`);
  }

  // Add the item to the pack
  const pack = packs[packIndex];
  const updatedPack = {
    ...pack,
    items: [...pack.items, newItem],
    updatedAt: new Date().toISOString(),
  };

  // Compute weights
  const computedPack = computePackWeights(updatedPack);

  // Update the store
  const updatedPacks = [...packs];
  updatedPacks[packIndex] = computedPack;
  store.set(packListAtom, updatedPacks);

  return { item: newItem, pack: computedPack };
};

const updateItem = async (item: PackItem): Promise<{ item: PackItem; pack: Pack }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Update the item
  const updatedItem = {
    ...item,
    updatedAt: new Date().toISOString(),
  };

  // Get the current pack
  const packs = store.get(packListAtom);
  const packIndex = packs.findIndex((p) => p.id === item.packId);

  if (packIndex === -1) {
    throw new Error(`Pack with ID ${item.packId} not found`);
  }

  // Update the item in the pack
  const pack = packs[packIndex];
  const updatedPack = {
    ...pack,
    items: pack.items.map((i) => (i.id === item.id ? updatedItem : i)),
    updatedAt: new Date().toISOString(),
  };

  // Compute weights
  const computedPack = computePackWeights(updatedPack);

  // Update the store
  const updatedPacks = [...packs];
  updatedPacks[packIndex] = computedPack;
  store.set(packListAtom, updatedPacks);

  return { item: updatedItem, pack: computedPack };
};

const deleteItem = async (id: string, packId: string): Promise<Pack> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Get the current pack
  const packs = store.get(packListAtom);
  const packIndex = packs.findIndex((p) => p.id === packId);

  if (packIndex === -1) {
    throw new Error(`Pack with ID ${packId} not found`);
  }

  // Remove the item from the pack
  const pack = packs[packIndex];
  const updatedPack = {
    ...pack,
    items: pack.items.filter((i) => i.id !== id),
    updatedAt: new Date().toISOString(),
  };

  // Compute weights
  const computedPack = computePackWeights(updatedPack);

  // Update the store
  const updatedPacks = [...packs];
  updatedPacks[packIndex] = computedPack;
  store.set(packListAtom, updatedPacks);

  return computedPack;
};

export function usePackItems(packId: string) {
  const queryClient = useQueryClient();

  const itemsQuery = useQuery({
    queryKey: ['packItems', packId],
    queryFn: () => fetchPackItems(packId),
    enabled: !!packId,
  });

  const createItemMutation = useMutation({
    mutationFn: createItem,
    onSuccess: (result) => {
      const { item: newItem, pack: updatedPack } = result;

      // Update the items query
      queryClient.setQueryData(['packItems', packId], (old: PackItem[] = []) => [...old, newItem]);

      // Update the pack query with the computed pack
      queryClient.setQueryData(['pack', packId], updatedPack);

      // Update the packs list
      queryClient.setQueryData(['packs'], (oldPacks: Pack[] = []) =>
        oldPacks.map((p) => (p.id === packId ? updatedPack : p))
      );
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: (result) => {
      const { item: updatedItem, pack: updatedPack } = result;

      // Update the items query
      queryClient.setQueryData(['packItems', packId], (old: PackItem[] = []) =>
        old.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );

      // Update the item query
      queryClient.setQueryData(['packItem', updatedItem.id], updatedItem);

      // Update the pack query with the computed pack
      queryClient.setQueryData(['pack', packId], updatedPack);

      // Update the packs list
      queryClient.setQueryData(['packs'], (oldPacks: Pack[] = []) =>
        oldPacks.map((p) => (p.id === packId ? updatedPack : p))
      );
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteItem(id, packId),
    onSuccess: (updatedPack, { id }) => {
      // Update the items query
      queryClient.setQueryData(['packItems', packId], (old: PackItem[] = []) =>
        old.filter((item) => item.id !== id)
      );

      // Remove the item query
      queryClient.removeQueries({ queryKey: ['packItem', id] });

      // Update the pack query with the computed pack
      queryClient.setQueryData(['pack', packId], updatedPack);

      // Update the packs list
      queryClient.setQueryData(['packs'], (oldPacks: Pack[] = []) =>
        oldPacks.map((p) => (p.id === packId ? updatedPack : p))
      );
    },
  });

  return {
    items: itemsQuery.data || [],
    isLoading: itemsQuery.isLoading,
    isError: itemsQuery.isError,
    error: itemsQuery.error,
    createItem: createItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
  };
}

export function usePackItemDetails(id: string, packId: string) {
  const fetchItem = async () => fetchItemById(id, packId);

  const itemQuery = useQuery({
    queryKey: ['packItem', id],
    queryFn: fetchItem,
    enabled: !!id && !!packId,
  });

  return {
    item: itemQuery.data,
    isLoading: itemQuery.isLoading,
    isError: itemQuery.isError,
    error: itemQuery.error,
  };
}
