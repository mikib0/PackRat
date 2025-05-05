import { use$, useSelector } from '@legendapp/state/react';

import { packItemsStore, packsStatus, packsStore } from '~/features/packs/store';
import { computeCategorySummaries } from '~/utils/computeCategories';

// Hook to get a single pack
export function usePackDetails(id: string) {
  const isLoading = useSelector(() => packsStatus.isLoading.get());
  const isError = useSelector(() => packsStatus.isError.get());
  const errorMessage = useSelector(() => packsStatus.errorMessage.get());

  const pack = use$(() => packsStore[id]?.get());
  const items = use$(() =>
    Object.values(packItemsStore.get()).filter((item) => item.packId === id && !item.deleted)
  );

  const totalWeight = pack.totalWeight ?? 0;

  const categories = computeCategorySummaries(items, totalWeight);

  return {
    ...pack,
    items,
    categories,
    isLoading,
    isError,
    errorMessage,
  };
}
