import { authMiddleware } from "@/middleware";
import { Hono } from "hono";
import { authRoutes } from "./auth";
import { catalogRoutes } from "./catalog";
import { chatRoutes } from "./chat";
import { helloRoutes } from "./hello";
import { packItemSuggestionsRoutes } from "./pack-item-suggestions";
import { packsRoutes } from "./packs";

const publicRoutes = new Hono();

// Mount public routes
publicRoutes.route("/auth", authRoutes);
publicRoutes.route("/hello", helloRoutes);

const protectedRoutes = new Hono();

protectedRoutes.use(authMiddleware);

// Mount protected routes
protectedRoutes.route("/hello", helloRoutes);
protectedRoutes.route("/catalog", catalogRoutes);
protectedRoutes.route("/packs", packsRoutes);
protectedRoutes.route("/chat", chatRoutes);
protectedRoutes.route("/pack-item-suggestions", packItemSuggestionsRoutes);

const routes = new Hono();

routes.route("/", publicRoutes);
routes.route("/", protectedRoutes);

export { routes };
