import { Router } from "express";
import { middleware } from "@xzihnago/express-utils";
import { PermissionBits, user } from "@/middleware";
import { updateSchema } from "./schemas";
import * as controller from "./controller";

const router = Router();

router.get(
  "/:name",
  user.authentication,
  user.permission(PermissionBits.EDIT_RELATION),
  controller.findRelations
);

router.put(
  "/:name",
  user.authentication,
  user.permission(PermissionBits.EDIT_RELATION),
  middleware.schemas.zod(updateSchema),
  controller.updateRelations
);

export default router;
