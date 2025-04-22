import { packsStore } from '~/features/packs/store';
import { useCallback } from 'react';
import type { Pack } from '../types';

// Hook to update a pack
export function useUpdatePack() {
  const updatePack = useCallback((pack: Pack) => {
    const updatedPack = {
      ...pack,
    };

    packsStore[pack.id].set(updatedPack);

    return updatedPack;
  }, []);

  return updatePack;
}
