import { use$ } from '@legendapp/state/react';
import { isAuthed } from '../store';
import { useAtomValue } from 'jotai';
import { isLoadingAtom, userAtom } from '../atoms/authAtoms';

export function useAuthState() {
  const user = useAtomValue(userAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const isAuthenticated = use$(isAuthed);

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}
