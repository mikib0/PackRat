import { createDb } from "@/db";
import { packItems, packs } from "@/db/schema";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { computePacksWeights } from "@/utils/compute-pack";
import { desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";

const dashboardRoutes = new Hono();

dashboardRoutes.get("", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  const db = createDb(c);

  try {
    const recentPacks = computePacksWeights(
      await db.query.packs.findMany({
        where: eq(packs.userId, Number(auth.userId)),
        orderBy: [desc(packs.createdAt)],
        limit: 5,
        with: {
          items: true,
        },
      }),
      "g"
    );

    const currentPack = recentPacks[0];

    if (!currentPack) {
      return c.json({
        currentPack: null,
        recentPacks: [],
        packWeight: 0,
        packCategoryCount: 0,
        upcomingTripCount: 0,
        weatherAlertCount: 0,
        gearInventryCount: 0,
        shoppingList: 0,
        packTemplateCount: 0,
      });
    }

    const categoryCountResult = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${packItems.category})` })
      .from(packItems)
      .where(eq(packItems.packId, Number(currentPack.id)));

    const packCategoryCount = categoryCountResult[0]?.count ?? 0;

    return c.json({
      currentPack,
      recentPacks,
      packWeight: currentPack.totalWeight,
      packCategoryCount,
      upcomingTripCount: 2,
      weatherAlertCount: 2,
      gearInventryCount: 20,
      shoppingList: 5,
      packTemplateCount: 4,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return c.json({ error: "Failed to load dashboard data" }, 500);
  }
});

export { dashboardRoutes };
