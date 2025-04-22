import { createDb } from "@/db";
import { packs } from "@/db/schema";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { computePacksWeights } from "@/utils/compute-pack";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

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
      where: eq(packs.id, packId), // No need to convert to Number anymore
      with: {
        items: true,
      },
    });

    if (!pack) {
      return c.json({ error: 'Pack not found' }, 404);
    }

    const packWithWeights = computePacksWeights([pack])[0];
    return c.json(packWithWeights);
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

    const [updatedPack] = await db
      .update(packs)
      .set({
        name: data.name,
        description: data.description,
        category: data.category,
        isPublic: data.isPublic,
        image: data.image,
        tags: data.tags,
        deleted: data.deleted,
        updatedAt: new Date(),
      })
      .where(eq(packs.id, packId))
      .returning();

    if (!updatedPack) {
      return c.json({ error: 'Pack not found' }, 404);
    }

    const packWithWeights = computePacksWeights([{...updatedPack, items: []}])[0];
    return c.json(packWithWeights);
  } catch (error) {
    console.error('Error updating pack:', error);
    return c.json({ error: 'Failed to update pack' }, 500);
  }
});

// Delete a pack
packRoutes.delete("/:packId", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  const db = createDb(c);
  try {
    const packId = c.req.param("packId");
    await db.delete(packs).where(eq(packs.id, packId));
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting pack:", error);
    return c.json({ error: "Failed to delete pack" }, 500);
  }
});

export { packRoutes };
