import { packsStore } from '~/features/packs/store';
import { useCallback } from 'react';
import type { Pack, PackInput } from '../types';
import { nanoid } from 'nanoid/non-secure';

// Hook to create a pack
export function useCreatePack() {
  const createPack = useCallback((packData: PackInput) => {
    const id = nanoid();

    const newPack: Omit<Pack, 'items'> = {
      id,
      ...packData,
      deleted: false,
    };

    packsStore[id].set(newPack);

  }, []);

  return createPack;
}
