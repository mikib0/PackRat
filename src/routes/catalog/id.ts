import { db } from "@/db";
import { catalogItems } from "@/db/schema";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const catalogItemRoutes = new Hono();

// Get catalog item by ID
catalogItemRoutes.get("/:id", async (c) => {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(c);
    if (!auth) {
      return unauthorizedResponse();
    }

    const itemId = Number(c.req.param("id"));

    const item = await db.query.catalogItems.findFirst({
      where: eq(catalogItems.id, itemId),
    });

    if (!item) {
      return c.json({ error: "Catalog item not found" }, 404);
    }

    return c.json(item);
  } catch (error) {
    console.error("Error fetching catalog item:", error);
    return c.json({ error: "Failed to fetch catalog item" }, 500);
  }
});

// Update catalog item
catalogItemRoutes.put("/:id", async (c) => {
  try {
    // Only admins should be able to update catalog items
    const auth = await authenticateRequest(c);
    if (!auth) {
      return unauthorizedResponse();
    }

    const itemId = Number(c.req.param("id"));
    const data = await c.req.json();

    // Check if the catalog item exists
    const existingItem = await db.query.catalogItems.findFirst({
      where: eq(catalogItems.id, itemId),
    });

    if (!existingItem) {
      return c.json({ error: "Catalog item not found" }, 404);
    }

    // Update the catalog item
    const [updatedItem] = await db
      .update(catalogItems)
      .set({
        name: data.name,
        description: data.description,
        defaultWeight: data.defaultWeight,
        defaultWeightUnit: data.defaultWeightUnit,
        category: data.category,
        image: data.image,
        brand: data.brand,
        model: data.model,
        url: data.url,
        ratingValue: data.ratingValue,
        productUrl: data.productUrl,
        color: data.color,
        size: data.size,
        sku: data.sku,
        price: data.price,
        availability: data.availability,
        seller: data.seller,
        productSku: data.productSku,
        material: data.material,
        currency: data.currency,
        condition: data.condition,
        techs: data.techs,
        links: data.links,
        reviews: data.reviews,
        updatedAt: new Date(),
      })
      .where(eq(catalogItems.id, itemId))
      .returning();

    return c.json(updatedItem);
  } catch (error) {
    console.error("Error updating catalog item:", error);
    return c.json({ error: "Failed to update catalog item" }, 500);
  }
});

// Delete catalog item
catalogItemRoutes.delete("/:id", async (c) => {
  try {
    // Only admins should be able to delete catalog items
    const auth = await authenticateRequest(c);
    if (!auth) {
      return unauthorizedResponse();
    }

    const itemId = Number(c.req.param("id"));

    // Check if the catalog item exists
    const existingItem = await db.query.catalogItems.findFirst({
      where: eq(catalogItems.id, itemId),
    });

    if (!existingItem) {
      return c.json({ error: "Catalog item not found" }, 404);
    }

    // Delete the catalog item
    await db.delete(catalogItems).where(eq(catalogItems.id, itemId));

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting catalog item:", error);
    return c.json({ error: "Failed to delete catalog item" }, 500);
  }
});

export { catalogItemRoutes };
