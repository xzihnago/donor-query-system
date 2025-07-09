import { Router } from "express";
import { middleware } from "@xzihnago/express-utils";
import { PermissionBits, user } from "@/middleware";
import { uploadSchema } from "./schemas";
import * as controller from "./controller";

const router = Router();

router.get(
  "/:name",
  user.authentication,
  user.permission(PermissionBits.SEARCH),
  controller.sumRecord
);

router.post(
  "/",
  user.authentication,
  user.permission(PermissionBits.MANAGE_DATABASE),
  middleware.schemas.zod(uploadSchema),
  controller.uploadRecord
);

router.get(
  "/",
  user.authentication,
  user.permission(PermissionBits.MANAGE_DATABASE),
  controller.exportSumRecord
);

export default router;
