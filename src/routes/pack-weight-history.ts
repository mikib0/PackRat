import { createDb } from "@/db";
import { packWeightHistory } from "@/db/schema";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const packWeightHistoryRoutes = new Hono();

// Helper function to group weight history by month and calculate averages
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
    const key = `${date.getFullYear()}-${date.getMonth()}`; // Use year + monthIndex as key
    if (!monthData[key]) {
      monthData[key] = { totalWeight: 0, count: 0 };
    }
    monthData[key].totalWeight += entry.weight;
    monthData[key].count += 1;
  });

  // Convert to readable format like "Mar"
  const monthlyAverages = Object.entries(monthData).map(
    ([key, { totalWeight, count }]) => {
      const [year, monthIndex] = key.split("-").map(Number);
      const monthName = monthNames[monthIndex];
      return {
        month: monthName,
        average_weight: parseFloat((totalWeight / count).toFixed(2)),
      };
    },
  );

  //  sort chronologically (oldest to newest)
  return monthlyAverages.sort(
    (a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month),
  );
};

// Helper function to filter data for the last 6 months
const filterLast6Months = (data: any[]) => {
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  return data.filter((entry) => new Date(entry.createdAt) >= sixMonthsAgo);
};

// Get monthly average weight history for a pack
packWeightHistoryRoutes.get("/weight-history/:packId", async (c) => {
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  const db = createDb(c);
  const packId = Number(c.req.param("packId"));

  try {
    // Fetch the weight history data for the given pack
    const history = await db.query.packWeightHistory.findMany({
      where: eq(packWeightHistory.packId, packId),
      orderBy: (history) => history.createdAt,
    });

    // Filter data for the last 6 months
    const filteredHistory = filterLast6Months(history);

    // Compute monthly average weights
    const monthlyAverages = getMonthlyWeightAverages(filteredHistory);

    console.log(
      "Filtered and Categorized Weight History:",
      JSON.stringify(monthlyAverages),
    );

    return c.json(monthlyAverages);
  } catch (error) {
    console.error("Error fetching weight history:", error);
    return c.json({ error: "Failed to fetch weight history" }, 500);
  }
});

export { packWeightHistoryRoutes };
