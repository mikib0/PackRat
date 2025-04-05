import * as schema from "@/db/schema";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Create SQL client with Neon
const sql = neon(process.env.NEON_DATABASE_URL!);

// Create Drizzle ORM instance with schema
export const db = drizzle(sql, { schema });
