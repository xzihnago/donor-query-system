import { Router } from "express";
import { middleware } from "@xzihnago/express-utils";
import { PermissionBits, user } from "@/middleware";
import { updateDonorRelationsValidate } from "./validates";
import * as controller from "./controller";

const router = Router();

router.get(
  "/:name",
  user.auth,
  user.parse,
  user.permission(PermissionBits.EDIT_RELATION),
  user.keepUp,
  controller.findRelations
);

router.post(
  "/",
  user.auth,
  middleware.validateSchema.zod(updateDonorRelationsValidate),
  user.parse,
  user.permission(PermissionBits.EDIT_RELATION),
  user.keepUp,
  controller.addRelations
);

router.delete(
  "/:name",
  user.auth,
  user.parse,
  user.permission(PermissionBits.EDIT_RELATION),
  user.keepUp,
  controller.removeRelations
);

export default router;
