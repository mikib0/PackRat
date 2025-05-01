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
export const tokenAtom = atomWithStorage<string | null>('access_token', null, {
  getItem: async (key) => SecureStore.getItemAsync(key),
  setItem: async (key, value) => {
    if (value === null) {
      return SecureStore.deleteItemAsync(key);
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key) => SecureStore.deleteItemAsync(key),
});

export const refreshTokenAtom = atomWithStorage<string | null>('refresh_token', null, {
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
export const isLoadingAtom = atom(false);

// Derived atom for authentication status
export const isAuthenticatedAtom = atom((get) => !!get(userAtom));

export const redirectToAtom = atom<string>('/');