import { createDb } from "@/db";
import { packs } from "@/db/schema";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { computePacksWeights } from "@/utils/compute-pack";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

const weightAnalysisRoutes = new Hono();

function convertToGrams(weight: number, unit: string): number {
  switch (unit.toLowerCase()) {
    case "kg":
      return weight * 1000;
    case "g":
      return weight;
    case "oz":
      return weight * 28.3495;
    case "lb":
      return weight * 453.592;
    default:
      return weight; // Default to grams if unit is unknown
  }
}

function computeCategorySummaries(items: any[]) {
  const categoryMap: Record<
    string,
    {
      weight: number;
      items: any[];
      weightUnit: string;
    }
  > = {};

  items.forEach((item) => {
    const category = item.category || "Uncategorized";
    const weight = item.weight ?? 0;
    const weightUnit = item.weightUnit || "g";

    if (!categoryMap[category]) {
      categoryMap[category] = {
        weight: 0,
        items: [],
        weightUnit,
      };
    }

    categoryMap[category].weight += convertToGrams(
      weight * (item.quantity || 1),
      weightUnit,
    );
    categoryMap[category].items.push(item);
  });

  return Object.entries(categoryMap).map(([name, data]) => ({
    name,
    weight: `${data.weight} ${data.weightUnit}`,
    items: data.items,
  }));
}

weightAnalysisRoutes.get("/weight-analysis/:packId", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) return unauthorizedResponse();
  const db = createDb(c);

  try {
    const packId = c.req.param("packId");

    const pack = await db.query.packs.findFirst({
      where: and(eq(packs.id, packId), eq(packs.userId, auth.userId)),
      with: {
        items: true,
      },
    });

    if (!pack) {
      return c.json({ error: "Pack not found" }, 404);
    }

    const [weightedPack] = computePacksWeights([pack], "g");

    const consumableWeightInGrams = pack.items
      .filter((item) => item.consumable)
      .reduce((sum, item) => {
        const unit = item.weightUnit || "g";
        const weight = item.weight || 0;
        return sum + convertToGrams(weight * (item.quantity || 1), unit);
      }, 0);

    const wornWeightInGrams = pack.items
      .filter((item) => item.worn)
      .reduce((sum, item) => {
        const unit = item.weightUnit || "g";
        const weight = item.weight || 0;
        return sum + convertToGrams(weight * (item.quantity || 1), unit);
      }, 0);

    const categorySummaries = computeCategorySummaries(pack.items);

    return c.json({
      baseWeight: weightedPack.baseWeight,
      consumableWeight: consumableWeightInGrams,
      wornWeight: wornWeightInGrams,
      totalWeight: weightedPack.totalWeight,
      categories: categorySummaries,
    });
  } catch (error) {
    console.error("Error computing weight analysis:", error);
    return c.json({ error: "Failed to compute weight analysis" }, 500);
  }
});

export { weightAnalysisRoutes };
