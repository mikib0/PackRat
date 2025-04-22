import { use$ } from '@legendapp/state/react';
import { packsStore } from '~/features/packs/store';

// Hook to get a single pack
export function usePackDetails(id: string) {
  const pack = use$(packsStore[id]);

  return pack;
}
