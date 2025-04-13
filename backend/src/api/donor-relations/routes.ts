import { Router } from "express";
import { middleware } from "@xzihnago/express-utils";
import { PermissionBits, user } from "@/middleware";
import { updateDonorRelationsValidate } from "./validates";
import * as controller from "./controller";

const router = Router();

router.get(
  "/:name",
  user.authentication,
  user.permission(PermissionBits.EDIT_RELATION),
  controller.findRelations
);

router.post(
  "/",
  user.authentication,
  user.permission(PermissionBits.EDIT_RELATION),
  middleware.validateSchema.zod(updateDonorRelationsValidate),
  controller.addRelations
);

router.delete(
  "/:name",
  user.authentication,
  user.permission(PermissionBits.EDIT_RELATION),
  controller.removeRelations
);

export default router;
