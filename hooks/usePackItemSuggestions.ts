import { useQuery } from '@tanstack/react-query';
import { catalogItemListAtom } from '~/atoms/itemListAtoms';
import { store } from '~/atoms/store';
import type { CatalogItem, PackItem } from '~/types';

// Helper function to get random items from the catalog
const getRandomItems = (
  items: CatalogItem[],
  count: number,
  excludeIds: string[] = []
): CatalogItem[] => {
  // Filter out items that are already in the pack
  const availableItems = items.filter((item) => !excludeIds.includes(item.id));

  // If we don't have enough items, return all available
  if (availableItems.length <= count) return availableItems;

  // Shuffle and pick random items
  const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to get AI suggestions
const fetchAISuggestions = async (
  packId: string,
  existingItemIds: string[]
): Promise<CatalogItem[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Get catalog items from store
  const catalogItems = store.get(catalogItemListAtom);

  // Generate random number between 2 and 5
  const suggestionCount = Math.floor(Math.random() * 4) + 2; // 2 to 5

  // Return random items
  return getRandomItems(catalogItems, suggestionCount, existingItemIds);
};

// Hook for fetching AI suggestions
export function usePackItemSuggestions(
  packId: string,
  packItems: PackItem[] = [],
  enabled = false
) {
  // Extract existing item IDs to avoid suggesting items already in the pack
  const existingItemIds = packItems
    .filter((item) => item.catalogItemId)
    .map((item) => item.catalogItemId as string);

  return useQuery({
    queryKey: ['packSuggestions', packId, existingItemIds.length],
    queryFn: () => fetchAISuggestions(packId, existingItemIds),
    enabled: !!packId && enabled,
    // Don't refetch automatically
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
