import { createDb } from "@/db";
import { packWeightHistory } from "@/db/schema";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const packWeightHistoryRoutes = new Hono();

// Helper: Compute monthly average weights from history
const getMonthlyWeightAverages = (data: any[]) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthData: Record<string, { totalWeight: number; count: number }> = {};

  data.forEach((entry) => {
    const date = new Date(entry.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`; // "YYYY-M"
    if (!monthData[key]) {
      monthData[key] = { totalWeight: 0, count: 0 };
    }
    monthData[key].totalWeight += entry.weight;

    monthData[key].count += 1;
  });

  const monthlyAverages = Object.entries(monthData).map(
    ([key, { totalWeight, count }]) => {
      const [year, monthIndex] = key.split("-").map(Number);
      return {
        year,
        month: monthNames[monthIndex],
        average_weight: parseFloat((totalWeight / count).toFixed(2)),
      };
    },
  );

  // Sort chronologically by year + month
  return monthlyAverages.sort((a, b) => {
    const aKey = `${a.year}-${monthNames.indexOf(a.month)}`;
    const bKey = `${b.year}-${monthNames.indexOf(b.month)}`;
    return aKey.localeCompare(bKey);
  });
};

// Helper: Filter entries within the last 6 months
const filterLast6Months = (data: any[]) => {
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 6);
  return data.filter((entry) => new Date(entry.createdAt) >= sixMonthsAgo);
};

// GET /weight-history/:packId — Return average weights by month (last 6 months)
packWeightHistoryRoutes.get("/weight-history/:packId", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) return unauthorizedResponse();

  const db = createDb(c);
  const packId = c.req.param("packId"); // keep as string (matches schema)

  try {
    const history = await db.query.packWeightHistory.findMany({
      where: eq(packWeightHistory.packId, packId),
      orderBy: (history) => history.createdAt,
    });

    const filtered = filterLast6Months(history);
    const monthlyAverages = getMonthlyWeightAverages(filtered);

    return c.json(monthlyAverages);
  } catch (error) {
    console.error("Error fetching weight history:", error);
    return c.json({ error: "Failed to fetch weight history" }, 500);
  }
});

export { packWeightHistoryRoutes };
