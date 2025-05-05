import { observable, syncState } from '@legendapp/state';
import { observablePersistSqlite } from '@legendapp/state/persist-plugins/expo-sqlite';
import { syncObservable } from '@legendapp/state/sync';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';
import Storage from 'expo-sqlite/kv-store';

import { Pack } from '../types';

import { isAuthed } from '~/features/auth/store';
import axiosInstance, { handleApiError } from '~/lib/api/client';

// Status Observables (Loading/Error States)
export const packsStatus = observable({
  isLoading: false,
  isError: false,
  errorMessage: '',
});

// API Handlers with Status State Updates
const listPacks = async () => {
  packsStatus.isLoading.set(true);
  packsStatus.isError.set(false);
  packsStatus.errorMessage.set('Failed to load packs');
  try {
    const res = await axiosInstance.get('/api/packs');
    return res.data;
  } catch (error) {
    const { message } = handleApiError(error);
    packsStatus.isError.set(true);
    packsStatus.errorMessage.set(message);
    throw new Error(`Failed to list packs: ${message}`);
  } finally {
    packsStatus.isLoading.set(false);
  }
};

const createPack = async (packData: Omit<Pack, 'items'>) => {
  packsStatus.isLoading.set(true);
  packsStatus.isError.set(false);
  packsStatus.errorMessage.set('Failed to create pack');
  try {
    const response = await axiosInstance.post('/api/packs', packData);
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    packsStatus.isError.set(true);
    packsStatus.errorMessage.set(message);
    throw new Error(`Failed to create pack: ${message}`);
  } finally {
    packsStatus.isLoading.set(false);
  }
};

const updatePack = async ({ id, ...data }: Omit<Pack, 'items'>) => {
  packsStatus.isLoading.set(true);
  packsStatus.isError.set(false);
  packsStatus.errorMessage.set('Failed to update pack');
  try {
    const response = await axiosInstance.put(`/api/packs/${id}`, data);
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    packsStatus.isError.set(true);
    packsStatus.errorMessage.set(message);
    throw new Error(`Failed to update pack: ${message}`);
  } finally {
    packsStatus.isLoading.set(false);
  }
};

// Observable Store and Sync Setup
export const packsStore = observable<Record<string, Omit<Pack, 'items'>>>({});

syncObservable(
  packsStore,
  syncedCrud({
    fieldUpdatedAt: 'updatedAt',
    fieldCreatedAt: 'createdAt',
    fieldDeleted: 'deleted',
    mode: 'merge',
    persist: {
      plugin: observablePersistSqlite(Storage),
      retrySync: true,
      name: 'packs',
    },
    waitFor: isAuthed,
    waitForSet: isAuthed,
    retry: {
      infinite: true, // Keep retrying until it saves
      backoff: 'exponential',
      maxDelay: 30000,
    },
    list: listPacks,
    create: createPack,
    update: updatePack,
    changesSince: 'last-sync',
    subscribe: ({ refresh }) => {
      const intervalId = setInterval(() => {
        refresh();
      }, 30000); // 30 seconds interval

      return () => {
        clearInterval(intervalId);
      };
    },
  })
);

export const packsSyncState = syncState(packsStore);

export type PacksStore = typeof packsStore;
