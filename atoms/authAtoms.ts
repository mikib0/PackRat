import { atom } from 'jotai';
import { currentUser } from '~/data/mockData';
import { User } from '~/types';
import { atomWithStorage } from 'jotai/utils';
import * as SecureStore from 'expo-secure-store';

export const authAtom = atom<User | null>(currentUser);

// Token storage atom
export const tokenAtom = atomWithStorage<string | null>('authToken', null, {
  getItem: async (key) => SecureStore.getItemAsync(key),
  setItem: async (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: async (key) => SecureStore.deleteItemAsync(key),
});

// User data atom
export const userAtom = atom<{ id: string; email: string } | null>(null);

// Authentication status atom
export const isAuthenticatedAtom = atom((get) => get(tokenAtom));

// Loading state atom
export const isLoadingAtom = atom(false);