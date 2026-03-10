import { Hono } from "hono";
import * as middleware from "@dqs/middleware";
import * as openapi from "./openapi";
import * as model from "./model";

const router = new Hono();

router.delete(
  "/",
  openapi.cleanup,
  middleware.authentication,
  middleware.permission(middleware.PermissionBits.MANAGE_DATABASE),
  async (c) => {
    const result = await model.deleteDataWithNoRelations();
    return c.json(result);
  },
);

export default router;
