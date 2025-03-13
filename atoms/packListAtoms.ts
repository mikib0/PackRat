import { atom } from 'jotai';
import { PackCategory } from '~/types';

export const activeFilterAtom = atom<PackCategory | 'all'>('all');
export const searchValueAtom = atom<string>('');
