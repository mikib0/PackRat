import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { routes } from "./routes";

const app = new Hono();

// Apply global middleware
app.use(logger());
app.use(cors());

// Mount routes
app.route("/api", routes);

// Health check endpoint
app.get("/", (c) => {
  return c.text("PackRat API is running!");
});

export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  fetch: app.fetch,
};
