import { Hono } from "hono";
import { packItemsRoutes } from "./items";
import { packsListRoutes } from "./list";
import { packRoutes } from "./pack";

const packsRoutes = new Hono();

packsRoutes.route("/", packsListRoutes);
packsRoutes.route("/", packRoutes);
packsRoutes.route("/", packItemsRoutes);

export { packsRoutes };
