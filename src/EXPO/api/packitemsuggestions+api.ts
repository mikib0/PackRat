import { authenticateRequest, unauthorizedResponse } from '~/utils/api-middleware';
import { getPackDetails, getCatalogItems } from '~/utils/DbUtils';

export async function POST(req: Request) {
  const auth = await authenticateRequest(req);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { packId, userId, location, categories } = await req.json();

    // Get pack details
    const pack = await getPackDetails(packId);
    if (!pack) {
      return new Response(JSON.stringify({ error: 'Pack not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get catalog items that could be suggested
    const catalogItems = await getCatalogItems(categories);

    // For now, let's implement a simple algorithm to suggest items
    // This avoids the AI complexity that's causing issues

    // Get existing categories and items in the pack
    const existingCategories = new Set(pack.items.map((item) => item.category || 'Uncategorized'));

    const existingItemNames = new Set(pack.items.map((item) => item.name.toLowerCase()));

    // Simple suggestion algorithm:
    // 1. Suggest items from categories not in the pack
    // 2. Suggest items that complement existing categories
    // 3. Don't suggest items with names already in the pack

    const suggestions = catalogItems.filter((item) => {
      // Don't suggest items already in the pack
      if (existingItemNames.has(item.name.toLowerCase())) {
        return false;
      }

      // Prioritize items from categories not in the pack
      if (item.category && !existingCategories.has(item.category)) {
        return true;
      }

      // Include some items from existing categories (complementary items)
      return Math.random() > 0.7; // Random selection for variety
    });

    // Limit to 5 suggestions
    const limitedSuggestions = suggestions.slice(0, 5);

    return new Response(JSON.stringify(limitedSuggestions), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Pack Item Suggestions API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process item suggestions request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
