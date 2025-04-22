import { packsStore } from '~/features/packs/store';
import { useCallback } from 'react';

// Hook to delete a pack
export function useDeletePack() {
  const deletePack = useCallback((id: string) => {
    // Soft delete by setting deleted flag
    const pack = packsStore[id].get();
    if (pack) {
      packsStore[id].set({
        ...pack,
        deleted: true,
      });
    }

    return Promise.resolve({ id });
  }, []);

  return deletePack;
}
