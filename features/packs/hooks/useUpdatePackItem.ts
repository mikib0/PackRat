import { packItemsStore, packsStore } from '~/features/packs/store';
import { useCallback } from 'react';
import type { PackItem } from '../types';

export function useUpdatePackItem() {
  const updatePackItem = useCallback((item: PackItem) => {
    packItemsStore[item.id].set(item);
    packsStore[item.packId].localUpdatedAt.set(new Date().toISOString());
  }, []);

  return updatePackItem;
}
