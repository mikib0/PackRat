import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { packListAtom } from '~/atoms/packListAtoms';
import { store } from '~/atoms/store';
import { computePackWeights } from '~/lib/utils/compute-pack';
import type { Pack, PackItem, WeightUnit } from '~/types';

// Helper function to get items for a specific pack
const getPackItems = (packId: string): PackItem[] => {
  const packs = store.get(packListAtom);
  const pack = packs.find((p) => p.id === packId);
  return pack?.items || [];
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

// Type for item creation/update
interface ItemInput {
  id?: string;
  packId: string;
  name: string;
  description: string;
  weight: number;
  weightUnit: WeightUnit;
  quantity: number;
  category: string;
  consumable: boolean;
  worn: boolean;
  notes: string;
  image: string | null;
}

const createOrUpdateItem = async (itemData: ItemInput): Promise<PackItem> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const isUpdate = !!itemData.id;
  const now = new Date().toISOString();

  // Get the current pack
  const packs = store.get(packListAtom);
  const packIndex = packs.findIndex((p) => p.id === itemData.packId);

  if (packIndex === -1) {
    throw new Error(`Pack with ID ${itemData.packId} not found`);
  }

  const pack = packs[packIndex];
  let updatedPack: Pack;
  let resultItem: PackItem;

  if (isUpdate) {
    // Update existing item
    resultItem = {
      ...itemData,
      id: itemData.id!,
      updatedAt: now,
      // Preserve createdAt from the original item
      createdAt: pack.items.find((i) => i.id === itemData.id)?.createdAt || now,
    } as PackItem;

    updatedPack = {
      ...pack,
      items: pack.items.map((i) => (i.id === itemData.id ? resultItem : i)),
      updatedAt: now,
    };
  } else {
    // Create new item
    resultItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    } as PackItem;

    updatedPack = {
      ...pack,
      items: [...pack.items, resultItem],
      updatedAt: now,
    };
  }

  // Compute weights
  const computedPack = computePackWeights(updatedPack);

  // Update the store
  const updatedPacks = [...packs];
  updatedPacks[packIndex] = computedPack;
  store.set(packListAtom, updatedPacks);

  return resultItem;
};

const deleteItem = async ({ id, packId }: { id: string; packId: string }): Promise<void> => {
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
};

// Hook for fetching items for a pack
export function useItems(packId: string) {
  return useQuery({
    queryKey: ['packItems', packId],
    queryFn: () => fetchPackItems(packId),
    enabled: !!packId,
  });
}

// Hook for fetching a single item
export function useItem(itemId: string | undefined, packId: string | undefined) {
  return useQuery({
    queryKey: ['packItem', itemId, packId],
    queryFn: () => fetchItemById(itemId as string, packId as string),
    enabled: !!itemId && !!packId,
  });
}

// Hook for creating/updating an item
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrUpdateItem,
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['packItems', data.packId] });
      queryClient.invalidateQueries({ queryKey: ['packItem', data.id] });
      queryClient.invalidateQueries({ queryKey: ['pack', data.packId] });
      queryClient.invalidateQueries({ queryKey: ['packs'] });
    },
  });
}

// Hook for deleting an item
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: (_, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['packItems', variables.packId] });
      queryClient.invalidateQueries({ queryKey: ['packItem', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['pack', variables.packId] });
      queryClient.invalidateQueries({ queryKey: ['packs'] });
    },
  });
}
