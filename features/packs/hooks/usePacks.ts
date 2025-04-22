import { use$ } from '@legendapp/state/react';
import { packsStore } from '~/features/packs/store';

// Hook to get all packs
export function usePacks() {
  const packs = use$(() => {
    const packsObj = packsStore.get();

    const packsArray = Object.values(packsObj || {});

    const filteredPacks = packsArray.filter((pack) => !pack.deleted); // TODO(localfirst): i suppose legend-state filters internally. tbd.

    return filteredPacks;
  });

  return packs;
}
