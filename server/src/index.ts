import { routes } from "@/routes";
import { Env } from "@/types/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono<{ Bindings: Env }>();

// Apply global middleware
app.use(logger());
app.use(cors());

// Mount routes
app.route("/api", routes);

// Health check endpoint
app.get("/", (c) => {
  return c.text("PackRat API is running!");
});

export default app;
