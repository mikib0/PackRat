import { atom } from 'jotai';
import { mockItems } from '~/data/mockData';
import type { Item } from '~/types';

export const itemListAtom = atom<Item[]>([...mockItems]);
export const searchValueAtom = atom('');
