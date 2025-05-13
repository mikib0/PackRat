import { createDb } from "@/db";
import { packs, packWeightHistory, type PackWithItems } from '@/db/schema';
import {
  authenticateRequest,
  unauthorizedResponse,
} from '@/utils/api-middleware';
import { computePackWeights } from '@/utils/compute-pack';
import { getCatalogItems, getPackDetails } from '@/utils/DbUtils';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';

const packRoutes = new Hono();

// Get a specific pack
packRoutes.get('/:packId', async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  const db = createDb(c);
  try {
    const packId = c.req.param('packId');
    const pack = await db.query.packs.findFirst({
      where: eq(packs.id, packId),
      with: {
        items: true,
      },
    });

    if (!pack) {
      return c.json({ error: 'Pack not found' }, 404);
    }
    return c.json(pack);
  } catch (error) {
    console.error('Error fetching pack:', error);
    return c.json({ error: 'Failed to fetch pack' }, 500);
  }
});

// Update a pack
packRoutes.put('/:packId', async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  const db = createDb(c);
  try {
    const packId = c.req.param('packId');
    const data = await c.req.json();

    await db
      .update(packs)
      .set({
        name: data.name,
        description: data.description,
        category: data.category,
        isPublic: data.isPublic,
        image: data.image,
        tags: data.tags,
        deleted: data.deleted,
        localUpdatedAt: new Date(data.localUpdatedAt),
        updatedAt: new Date(),
      })
      .where(and(eq(packs.id, packId), eq(packs.userId, auth.userId)));

    const updatedPack: PackWithItems | undefined =
      await db.query.packs.findFirst({
        where: and(eq(packs.id, packId), eq(packs.userId, auth.userId)),
        with: {
          items: true,
        },
      });

    if (!updatedPack) {
      return c.json({ error: 'Pack not found' }, 404);
    }

    const packWithWeights = computePackWeights(updatedPack);
    return c.json(packWithWeights);
  } catch (error) {
    console.error('Error updating pack:', error);
    return c.json({ error: 'Failed to update pack' }, 500);
  }
});

// Delete a pack
packRoutes.delete('/:packId', async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  const db = createDb(c);
  try {
    const packId = c.req.param('packId');
    await db.delete(packs).where(eq(packs.id, packId));
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting pack:', error);
    return c.json({ error: 'Failed to delete pack' }, 500);
  }
});

packRoutes.post('/:packId/item-suggestions', async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const packId = c.req.param('packId');
    const { categories } = await c.req.json();

    // Get pack details
    const pack = await getPackDetails({ packId, c });
    if (!pack) {
      return c.json({ error: 'Pack not found' }, 404);
    }

    // Get catalog items that could be suggested
    const catalogItems = await getCatalogItems({ options: { categories }, c });

    // For now, let's implement a simple algorithm to suggest items
    // This avoids the AI complexity that's causing issues

    // Get existing categories and items in the pack
    const existingCategories = new Set(
      pack.items.map((item) => item.category || 'Uncategorized')
    );

    const existingItemNames = new Set(
      pack.items.map((item) => item.name.toLowerCase())
    );

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

    return c.json(limitedSuggestions);
  } catch (error) {
    console.error('Pack Item Suggestions API error:', error);
    return c.json({ error: 'Failed to process item suggestions request' }, 500);
  }
});

packRoutes.post('/:packId/weight-history', async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  const db = createDb(c);
  try {
    const packId = c.req.param('packId');
    const data = await c.req.json();

    const packWeightHistoryEntry = await db
      .insert(packWeightHistory)
      .values({
        id: data.id,
        packId,
        userId: auth.userId,
        weight: data.weight,
        localCreatedAt: new Date(data.localCreatedAt),
      })
      .returning();

    return c.json(packWeightHistoryEntry);
  } catch (error) {
    console.error('Pack weight history API error:', error);
    return c.json({ error: 'Failed to create weight history entry' }, 500);
  }
});


export { packRoutes };
