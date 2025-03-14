import { useQuery } from '@tanstack/react-query';
import { catalogItemListAtom } from '~/atoms/itemListAtoms';
import { store } from '~/atoms/store';

const fetchItems = async () => {
  const items = store.get(catalogItemListAtom);
  return items;
};

export function useCatalogItems() {
  return useQuery({
    queryKey: ['catalogItems'],
    queryFn: fetchItems,
  });
}
