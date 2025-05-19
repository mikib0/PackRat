import { Hono } from "hono";
import { catalogItemRoutes } from "./id";
import { catalogListRoutes } from "./list";

const catalogRoutes = new Hono();

catalogRoutes.route("/", catalogListRoutes);
catalogRoutes.route("/", catalogItemRoutes);

export { catalogRoutes };
