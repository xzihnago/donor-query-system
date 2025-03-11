import { Router } from "express";
import { PermissionBits, user } from "@/middleware";
import * as controller from "./controller";
import { middleware } from "@xzihnago/express-utils";
import { uploadDonorRecordsValidate } from "./validates";

const router = Router();

router.get(
  "/search/:name",
  user.auth,
  user.parse,
  user.permission(PermissionBits.SEARCH),
  user.keepUp,
  controller.searchRecords
);

router.post(
  "/upload",
  user.auth,
  user.parse,
  user.permission(PermissionBits.MANAGE_DATABASE),
  user.keepUp,
  middleware.validateSchema.zod(uploadDonorRecordsValidate),
  controller.uploadRecords
);

router.get(
  "/export",
  user.auth,
  user.parse,
  user.permission(PermissionBits.MANAGE_DATABASE),
  user.keepUp,
  controller.exportRecords
);

export default router;
