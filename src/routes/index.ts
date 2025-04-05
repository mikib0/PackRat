import { Hono } from "hono";
import { authRoutes } from "./auth";
import { catalogRoutes } from "./catalog";
import { chatRoutes } from "./chat";
import { helloRoutes } from "./hello";
import { packItemSuggestionsRoutes } from "./pack-item-suggestions";
import { packsRoutes } from "./packs";

const routes = new Hono();

// Mount routes
routes.route("/auth", authRoutes);
routes.route("/catalog", catalogRoutes);
routes.route("/packs", packsRoutes);
routes.route("/chat", chatRoutes);
routes.route("/hello", helloRoutes);
routes.route("/pack-item-suggestions", packItemSuggestionsRoutes);

export { routes };
