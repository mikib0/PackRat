import { Hono } from "hono";

const helloRoutes = new Hono();

helloRoutes.get("/", (c) => {
  return c.json({ hello: "world" });
});

export { helloRoutes };
