import { Hono } from "hono";
import { userItemsRoutes } from "./items";

const userRoutes = new Hono();

userRoutes.route("/", userItemsRoutes);

export { userRoutes };
