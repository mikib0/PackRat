import { packsStore } from '~/features/packs/store';
import { useCallback } from 'react';
import type { Pack } from '../types';

export function useUpdatePack() {
  const updatePack = useCallback((pack: Pack) => {
    packsStore[pack.id].set(pack);
  }, []);

  return updatePack;
}
