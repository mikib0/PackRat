import { observable } from '@legendapp/state';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';
import axiosInstance, { handleApiError } from '~/lib/api/client';
import { syncObservable } from '@legendapp/state/sync';
import Storage from 'expo-sqlite/kv-store';
import { observablePersistSqlite } from '@legendapp/state/persist-plugins/expo-sqlite';
import { Pack, PackItem } from '../types';
import { isAuthed } from '~/features/auth/store';

const listAllPackItems = async () => {
  try {
    const res = await axiosInstance.get<Pack[]>('/api/packs');
    return res.data.flatMap((pack: Pack) => pack.items);
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to list packitems: ${message}`);
  }
};

const createPackItem = async ({ packId, ...data }: PackItem) => {
  try {
    const response = await axiosInstance.post(`/api/packs/${packId}/items`, data);
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to create pack item: ${message}`);
  }
};

const updatePackItem = async ({ id, packId, ...data }: PackItem) => {
  try {
    const response = await axiosInstance.put(`/api/packs/${packId}/items/${id}`, data);
    return response.data;
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to update pack: ${message}`);
  }
};

export const packItemsStore = observable<Record<string, PackItem>>({});

syncObservable(
  packItemsStore,
  syncedCrud({
    fieldUpdatedAt: 'updatedAt',
    fieldCreatedAt: 'createdAt',
    fieldDeleted: 'deleted',
    persist: {
      plugin: observablePersistSqlite(Storage),
      retrySync: true,
      name: 'packItems',
    },
    waitFor: isAuthed,
    waitForSet: isAuthed,
    retry: {
      infinite: true, // Keep retrying until it saves
      backoff: 'exponential',
      maxDelay: 30000,
    },
    list: listAllPackItems,
    create: createPackItem,
    update: updatePackItem,
    changesSince: 'last-sync',
  })
);

export type PackItemsStore = typeof packItemsStore;
