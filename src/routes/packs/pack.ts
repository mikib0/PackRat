import { createDb } from "@/db";
import { packs, type PackWithItems } from '@/db/schema';
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { computePacksWeights, computePackWeights } from '@/utils/compute-pack';
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const packRoutes = new Hono();

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
      return weight; // Assume grams if unknown
  }
}

// Helper to compute categories summary
function computeCategorySummaries(items: any[], totalPackWeight: number) {
  const categoryMap: Record<
    string,
    {
      weightInGrams: number;
      items: number;
      originalWeight: number;
      weightUnit: string;
    }
  > = {};

  items.forEach((item) => {
    const category = item.category;
    const weight = item.weight ?? 0;
    const unit = item.weightUnit ?? "g";
    const convertedWeight = convertToGrams(weight, unit) * item.quantity;

    if (!categoryMap[category]) {
      categoryMap[category] = {
        weightInGrams: 0,
        items: 0,
        originalWeight: weight,
        weightUnit: unit,
      };
    }

    categoryMap[category].weightInGrams += convertedWeight;
    categoryMap[category].items += 1;
  });

  console.log("categorymap", categoryMap);
  console.log("totalPackWeight", totalPackWeight);

  return Object.entries(categoryMap).map(([name, data]) => {
    const percentage =
      totalPackWeight > 0 ? (data.weightInGrams / totalPackWeight) * 100 : 0;

    return {
      name,
      items: data.items,
      weight: {
        value: data.originalWeight,
        unit: data.weightUnit,
      },
      percentage: Math.round(percentage),
    };
  });
}

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

    const packWithWeights = computePacksWeights([pack])[0];
    const totalPackWeight = packWithWeights.totalWeight ?? 0;

    const categorySummaries = computeCategorySummaries(
      pack.items,
      totalPackWeight,
    );

    return c.json({
      ...packWithWeights,
      categories: categorySummaries,
    });
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

    const updatedPack: PackWithItems = await db.transaction(async (tx) => {
      await tx
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
        .where(eq(packs.id, packId));

      const updatedPackWithItems = await tx.query.packs.findFirst({
        where: eq(packs.id, packId),
        with: {
          items: true,
        },
      });

      return updatedPackWithItems!;
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
