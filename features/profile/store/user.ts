import { observable, syncState } from '@legendapp/state';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';
import axiosInstance, { handleApiError } from '~/lib/api/client';
import { syncObservable } from '@legendapp/state/sync';
import Storage from 'expo-sqlite/kv-store';
import { observablePersistSqlite } from '@legendapp/state/persist-plugins/expo-sqlite';
import { isAuthed } from '~/features/auth/store';
import { User } from '../types';

const getUser = async () => {
  try {
    const res = await axiosInstance.get('/api/auth/me');
    return res.data.user;
  } catch (error) {
    const { message } = handleApiError(error);
    throw new Error(`Failed to get profile: ${message}`);
  }
};

export const userStore = observable<User>();

syncObservable(
  userStore,
  syncedCrud({
    persist: {
      plugin: observablePersistSqlite(Storage),
      retrySync: true,
      name: 'user',
    },
    waitFor: isAuthed,
    waitForSet: isAuthed,
    retry: {
      infinite: true, // Keep retrying until it saves
      backoff: 'exponential',
      maxDelay: 30000,
    },
    get: getUser,
    // TODO localfirst subscribe
  })
);

export const userSyncState = syncState(userStore);

export type UserStore = typeof userStore;
