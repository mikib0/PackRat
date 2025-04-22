import { observable } from '@legendapp/state';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';
import axiosInstance, { handleApiError } from '~/lib/api/client';
import { syncObservable } from '@legendapp/state/sync';
import Storage from 'expo-sqlite/kv-store';
import { observablePersistSqlite } from '@legendapp/state/persist-plugins/expo-sqlite';
import { Pack } from '../types';
import { isAuthed } from '~/features/auth/store';

const listPacks = async (options) => {
  console.log('list packs');
  if (options) {
    console.log('list options', options);
  }
  try {
    const res = await axiosInstance.get('/api/packs');
    console.log('res.data', res.data);
    return res.data;
  } catch (error) {
    console.log('error listpacks', error);
    const { message } = handleApiError(error);
    throw new Error(`Failed to list packs: ${message}`);
  }
};
const createPack = async (packData) => {
  console.log('create arg');
  if (packData) {
    console.log('packData', packData);
  }
  if (packData) console.log('packDtat', packData);
  try {
    const response = await axiosInstance.post('/api/packs', packData);
    console.log('response.data', response.data);
    return response.data;
  } catch (error) {
    console.log('error createpack', error);
    const { message } = handleApiError(error);
    throw new Error(`Failed to create pack: ${message}`);
  }
};
const updatePack = async ({ id, ...data }) => {
  console.log('update packsssssss');
  if (data) {
    console.log('update pack with', id, data);
  }
  try {
    const response = await axiosInstance.put(`/api/packs/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('error updatepack', error);
    const { message } = handleApiError(error);
    throw new Error(`Failed to update pack: ${message}`);
  }
};

export const packsStore = observable<Record<string, Pack>>({});

syncObservable(
  packsStore,
  syncedCrud({
    fieldUpdatedAt: 'updatedAt',
    fieldCreatedAt: 'createdAt',
    fieldDeleted: 'deleted',
    // initial: {},
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
    // mode: 'merge',
    changesSince: 'last-sync',
  })
);

// Type for the packs store
export type PacksStore = typeof packsStore;
