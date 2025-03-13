import type { PackItem } from '~/types';

/**
 * Calculates the base weight and total weight of a pack based on its items
 *
 * Base weight: Sum of all non-consumable, non-worn items
 * Total weight: Sum of all items (including consumables and worn items)
 */
export function calculatePackWeight(items: PackItem[]) {
  if (!items || items.length === 0) {
    return { baseWeight: 0, totalWeight: 0 };
  }

  let baseWeight = 0;
  let totalWeight = 0;

  items.forEach((item) => {
    // Convert all weights to the same unit (grams) for calculation
    // In a real app, you'd want to handle unit conversion more robustly
    const itemWeight = item.weight * item.quantity;

    // Add to total weight regardless of item type
    totalWeight += itemWeight;

    // Only add to base weight if item is not consumable and not worn
    if (!item.consumable && !item.worn) {
      baseWeight += itemWeight;
    }
  });

  return { baseWeight, totalWeight };
}
