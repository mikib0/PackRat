import { createDb } from "@/db";
import { packItems } from "@/db/schema";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const userItemsRoutes = new Hono();

// Get all pack items for the authenticated user
userItemsRoutes.get("/items", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  const db = createDb(c);

  try {
    const items = await db.query.packItems.findMany({
      where: eq(packItems.userId, auth.userId),
      with: {
        catalogItem: true,
      },
    });

    return c.json(items);
  } catch (error) {
    console.error("Error fetching user's pack items:", error);
    return c.json({ error: "Failed to fetch pack items" }, 500);
  }
});

export { userItemsRoutes };
