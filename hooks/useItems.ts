import { useQuery } from '@tanstack/react-query';
import { catalogItemListAtom } from '~/atoms/itemListAtoms';
import { packListAtom } from '~/atoms/packListAtoms';
import { store } from '~/atoms/store';

const fetchItems = async () => {
  const items = store.get(catalogItemListAtom);
  const packs = store.get(packListAtom);

  // Calculate usage count for each catalog item based on unique packs
  return items.map((item) => {
    // Get all packs that contain this catalog item
    const packsWithItem = packs.filter((pack) =>
      pack.items.some((packItem) => packItem.catalogItemId === item.id)
    );

    // Count unique packs
    const usageCount = packsWithItem.length;

    return {
      ...item,
      usageCount,
    };
  });
};

const fetchItemById = async (id: string) => {
  const items = store.get(catalogItemListAtom);
  const packs = store.get(packListAtom);
  const item = items.find((item) => item.id === id) || null;

  if (item) {
    // Get all packs that contain this catalog item
    const packsWithItem = packs.filter((pack) =>
      pack.items.some((packItem) => packItem.catalogItemId === item.id)
    );

    // Count unique packs
    const usageCount = packsWithItem.length;

    return {
      ...item,
      usageCount,
    };
  }

  return null;
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
