import { use$ } from '@legendapp/state/react';
import { packItemsStore, packsStore } from '~/features/packs/store';

// Hook to get a single pack
export function usePackDetails(id: string) {
  const pack = use$(() => {
    return {
      ...packsStore[id].get(),
      items: Object.values(packItemsStore.get()).filter(
        (item) => item.packId == id && !item.deleted
      ),
    };
  });

  return pack;
}
