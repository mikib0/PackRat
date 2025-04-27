import { createDb } from "@/db";
import { packItems, packs } from "@/db/schema";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

const packItemsRoutes = new Hono();

// Get all items for a pack
packItemsRoutes.get("/:packId/items", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  const db = createDb(c);

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

// Get pack item by ID
packItemsRoutes.get('/items/:itemId', async (c) => {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(c);
    if (!auth) {
      return unauthorizedResponse();
    }

    const db = createDb(c);
    const userId = auth.userId;
    const itemId = c.req.param("itemId");

    // Get the item
    const item = await db.query.packItems.findFirst({
      where: and(
        eq(packItems.id, itemId),
        eq(packItems.userId, Number(userId))
      ),
      with: {
        catalogItem: true,
      },
    });

    if (!item) {
      return c.json({ error: "Item not found" }, { status: 404 });
    }

    return c.json(item);
  } catch (error) {
    console.error("Error fetching pack item:", error);
    return c.json({ error: "Failed to fetch pack item" }, { status: 500 });
  }
});

// Add an item to a pack
packItemsRoutes.post("/:packId/items", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  const db = createDb(c);
  try {
    const packId = c.req.param("packId");
    const data = await c.req.json();

    if (!packId) {
      return c.json({ error: "Pack ID is required" }, 400);
    }

    if (!data.id) {
      return c.json({ error: 'Item ID is required' }, 400);
    }

    const [newItem] = await db
      .insert(packItems)
      .values({
        id: data.id,
        packId: packId,
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
packItemsRoutes.patch("/items/:itemId", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  const db = createDb(c);
  try {
    const itemId = c.req.param("itemId");
    const data = await c.req.json();

    const [updatedItem] = await db
      .update(packItems)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(packItems.id, itemId))
      .returning();

    if (!updatedItem) {
      return c.json({ error: 'Pack item not found' }, 404);
    }

    // Update the pack's updatedAt timestamp
    await db
      .update(packs)
      .set({ updatedAt: new Date() })
      .where(eq(packs.id, updatedItem.packId));

    return c.json(updatedItem);
  } catch (error) {
    console.error("Error updating pack item:", error);
    return c.json({ error: "Failed to update pack item" }, 500);
  }
});

export { packItemsRoutes };
