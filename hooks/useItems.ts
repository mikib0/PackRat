import { useQuery } from '@tanstack/react-query';
import { catalogItemListAtom } from '~/atoms/itemListAtoms';
import { store } from '~/atoms/store';

const fetchItems = async () => {
  const items = store.get(catalogItemListAtom);
  return items;
};

const fetchItemById = async (id: string) => {
  const items = store.get(catalogItemListAtom);
  return items.find((item) => item.id === id) || null;
};

export function useCatalogItems() {
  return useQuery({
    queryKey: ['catalogItems'],
    queryFn: fetchItems,
  });
}

export function useCatalogItemDetails(id: string) {
  return useQuery({
    queryKey: ['catalogItem', id],
    queryFn: () => fetchItemById(id),
    enabled: !!id,
  });
}
