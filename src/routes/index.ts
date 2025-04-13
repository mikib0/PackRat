import { authMiddleware } from "@/middleware";
import { Hono } from "hono";
import { authRoutes } from "./auth";
import { catalogRoutes } from "./catalog";
import { chatRoutes } from "./chat";
import { packItemSuggestionsRoutes } from "./pack-item-suggestions";
import { packsRoutes } from "./packs";
import { weatherRoutes } from "./weather";
import { dashboardRoutes } from "./dashboard";

const publicRoutes = new Hono();

// Mount public routes
publicRoutes.route("/auth", authRoutes);

const protectedRoutes = new Hono();

protectedRoutes.use(authMiddleware);

// Mount protected routes
protectedRoutes.route("/catalog", catalogRoutes);
protectedRoutes.route("/packs", packsRoutes);
protectedRoutes.route("/chat", chatRoutes);
protectedRoutes.route("/pack-item-suggestions", packItemSuggestionsRoutes);
publicRoutes.route("/weather", weatherRoutes);
protectedRoutes.route("/dashboard", dashboardRoutes);

const routes = new Hono();

routes.route("/", publicRoutes);
routes.route("/", protectedRoutes);

export { routes };
