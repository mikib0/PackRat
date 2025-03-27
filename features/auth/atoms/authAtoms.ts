import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import * as SecureStore from 'expo-secure-store';

// User type definition
export type User = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
};

// Token storage atom
export const tokenAtom = atomWithStorage<string | null>('auth_token', null, {
  getItem: async (key) => SecureStore.getItemAsync(key),
  setItem: async (key, value) => {
    if (value === null) {
      return SecureStore.deleteItemAsync(key);
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key) => SecureStore.deleteItemAsync(key),
});

// User data atom
export const userAtom = atom<User | null>(null);

// Loading state atom
export const isLoadingAtom = atom(true);

// Account linking modal state atoms
export const showLinkingModalAtom = atom(false);
export const linkingDataAtom = atom<{
  provider: 'google' | 'apple';
  email: string;
  token: string;
} | null>(null);

// Derived atom for authentication status
export const isAuthenticatedAtom = atom((get) => !!get(userAtom));
