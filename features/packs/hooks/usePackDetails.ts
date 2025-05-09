import { use$ } from '@legendapp/state/react';

import { packItemsStore, packsStore } from '~/features/packs/store';
import { computeCategorySummaries } from '~/utils/computeCategories';

// Hook to get a single pack
export function usePackDetails(id: string) {
  const pack = use$(() => packsStore[id]?.get());
  const items = use$(() =>
    Object.values(packItemsStore.get()).filter((item) => item.packId === id && !item.deleted)
  );

  const refetch = () => {
    packsStore[id]?.set({ ...packsStore[id].get() });
    packItemsStore.set({ ...packItemsStore.get() });
  };

  const totalWeight = pack.totalWeight ?? 0;
  const categories = computeCategorySummaries(items, totalWeight);

  return {
    ...pack,
    items,
    categories,
    refetch,
  };
}
