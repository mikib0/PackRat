import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Neon serverless driver to work in Node.js
neonConfig.webSocketConstructor = ws;

// Create SQL client with Neon
const sql = neon(process.env.NEON_DATABASE_URL!);

// Create Drizzle ORM instance
export const db = drizzle(sql);
