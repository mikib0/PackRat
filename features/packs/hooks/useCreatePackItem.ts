import { packItemsStore, packsStore } from '~/features/packs/store';
import { useCallback } from 'react';
import type { PackItem, PackItemInput } from '../types';
import { nanoid } from 'nanoid/non-secure';

export function useCreatePackItem() {
  const createPackItem = useCallback(
    ({ packId, itemData }: { packId: string; itemData: PackItemInput }) => {
      const id = nanoid();

      const newItem: PackItem = {
        id,
        ...itemData,
        packId,
        deleted: false,
      };

      packItemsStore[id].set(newItem);
      packsStore[packId].localUpdatedAt.set(new Date().toISOString());
    },
    []
  );

  return createPackItem;
}
