import { db } from "@/db";
import { packItems, packs } from "@/db/schema";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const packItemsRoutes = new Hono();

// Get all items for a pack
packItemsRoutes.get("/", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const packId = c.req.param("packId");
    const items = await db.query.packItems.findMany({
      where: eq(packItems.packId, packId),
      with: {
        catalogItem: true,
      },
    });
    return c.json(items);
  } catch (error) {
    console.error("Error fetching pack items:", error);
    return c.json({ error: "Failed to fetch pack items" }, 500);
  }
});

// Add an item to a pack
packItemsRoutes.post("/", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const packId = c.req.param("packId");
    const data = await c.req.json();

    if (!packId) {
      return c.json({ error: "Pack ID is required" }, 400);
    }

    const [newItem] = await db
      .insert(packItems)
      .values({
        packId,
        catalogItemId: data.catalogItemId ? Number(data.catalogItemId) : null,
        name: data.name,
        description: data.description,
        weight: data.weight,
        weightUnit: data.weightUnit,
        quantity: data.quantity || 1,
        category: data.category,
        consumable: data.consumable || false,
        worn: data.worn || false,
        image: data.image,
        notes: data.notes,
        userId: auth.userId,
      })
      .returning();

    // Update the pack's updatedAt timestamp
    await db
      .update(packs)
      .set({ updatedAt: new Date() })
      .where(eq(packs.id, packId));

    return c.json(newItem);
  } catch (error) {
    console.error("Error adding pack item:", error);
    return c.json({ error: "Failed to add pack item" }, 500);
  }
});

// Update a pack item
packItemsRoutes.put("/:itemId", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const packId = c.req.param("packId");
    const itemId = c.req.param("itemId");
    const data = await c.req.json();

    const [updatedItem] = await db
      .update(packItems)
      .set({
        name: data.name,
        description: data.description,
        weight: data.weight,
        weightUnit: data.weightUnit,
        quantity: data.quantity,
        category: data.category,
        consumable: data.consumable,
        worn: data.worn,
        image: data.image,
        notes: data.notes,
        catalogItemId: data.catalogItemId ? Number(data.catalogItemId) : null,
        updatedAt: new Date(),
      })
      .where(eq(packItems.id, itemId))
      .returning();

    if (!updatedItem) {
      return c.json({ error: "Pack item not found" }, 404);
    }

    // Update the pack's updatedAt timestamp
    await db
      .update(packs)
      .set({ updatedAt: new Date() })
      .where(eq(packs.id, packId));

    return c.json(updatedItem);
  } catch (error) {
    console.error("Error updating pack item:", error);
    return c.json({ error: "Failed to update pack item" }, 500);
  }
});

// Delete a pack item
packItemsRoutes.delete("/:itemId", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const packId = c.req.param("packId");
    const itemId = c.req.param("itemId");
    await db.delete(packItems).where(eq(packItems.id, itemId));

    // Update the pack's updatedAt timestamp
    await db
      .update(packs)
      .set({ updatedAt: new Date() })
      .where(eq(packs.id, packId));

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting pack item:", error);
    return c.json({ error: "Failed to delete pack item" }, 500);
  }
});

export { packItemsRoutes };
