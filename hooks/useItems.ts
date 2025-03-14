import { useQuery } from '@tanstack/react-query';
import { itemListAtom } from '~/atoms/itemListAtoms';
import { store } from '~/atoms/store';

const fetchItems = async () => {
  const items = store.get(itemListAtom);
  return items;
};

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });
}
