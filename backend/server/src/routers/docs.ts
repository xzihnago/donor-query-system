import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import routeApi from "@dqs/api";

const router = new Hono();

router.get(
  "/openapi",
  openAPIRouteHandler(routeApi, {
    documentation: {
      info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "",
      },
    },
  }),
);

router.get(
  "/docs",
  Scalar({ url: "/openapi", pageTitle: "API Documentation" }),
);

export default router;
