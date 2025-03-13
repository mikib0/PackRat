import { atom } from 'jotai';
import { currentUser } from '~/data/mockData';
import { User } from '~/types';

export const authAtom = atom<User | null>(currentUser);
