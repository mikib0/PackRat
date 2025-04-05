import { Hono } from "hono";
import { authRoutes } from "./routes/auth";
import { catalogRoutes } from "./routes/catalog";
import { chatRoutes } from "./routes/chat";
import { helloRoutes } from "./routes/hello";
import { packItemSuggestionsRoutes } from "./routes/pack-item-suggestions";
import { packRoutes } from "./routes/packs";

const app = new Hono();

// Mount routes
app.route("/auth", authRoutes);
app.route("/catalog", catalogRoutes);
app.route("/packs", packRoutes);
app.route("/chat", chatRoutes);
app.route("/hello", helloRoutes);
app.route("/pack-item-suggestions", packItemSuggestionsRoutes);

// Health check endpoint
app.get("/", (c) => {
  return c.text("PackRat API is running!");
});

export default app;
