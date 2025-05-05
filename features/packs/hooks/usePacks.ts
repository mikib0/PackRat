import { use$, useSelector } from '@legendapp/state/react';
import { packsStore, packsStatus } from '~/features/packs/store';

export function usePacks() {
  const isLoading = useSelector(() => packsStatus.isLoading.get());
  const isError = useSelector(() => packsStatus.isError.get());
  const errorMessage = useSelector(() => packsStatus.errorMessage.get());

  const packs = use$(() => {
    return Object.values(packsStore.get()).filter((pack) => !pack.deleted);
  });

  return {
    packs,
    isLoading,
    isError,
    errorMessage,
  };
}
