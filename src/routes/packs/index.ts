import { db } from "@/db";
import { packs } from "@/db/schema";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { computePacksWeights } from "@/utils/compute-pack";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { packItemsRoutes } from "./items";
import { packRoutes } from "./pack";

const packsRoutes = new Hono();

// Get all packs for the user
packsRoutes.get("/", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const userPacks = await db.query.packs.findMany({
      where: eq(packs.userId, auth.userId),
      with: {
        items: true,
      },
    });

    const packsWithWeights = computePacksWeights(userPacks);
    return c.json(packsWithWeights);
  } catch (error) {
    console.error("Error fetching packs:", error);
    return c.json({ error: "Failed to fetch packs" }, 500);
  }
});

// Create a new pack
packsRoutes.post("/", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const data = await c.req.json();
    const [newPack] = await db
      .insert(packs)
      .values({
        userId: auth.userId,
        name: data.name,
        description: data.description,
        category: data.category,
        isPublic: data.isPublic,
        image: data.image,
        tags: data.tags,
      })
      .returning();

    const packWithWeights = computePacksWeights([{ ...newPack, items: [] }])[0];
    return c.json(packWithWeights);
  } catch (error) {
    console.error("Error creating pack:", error);
    return c.json({ error: "Failed to create pack" }, 500);
  }
});

// Mount the pack-specific routes
packsRoutes.route("/:packId", packRoutes);
packsRoutes.route("/:packId/items", packItemsRoutes);

export { packsRoutes };
