import { Router } from "express";
import { PermissionBits, user } from "@/middleware";
import * as controller from "./controller";
import { middleware } from "@xzihnago/express-utils";
import { uploadDonorRecordsValidate } from "./validates";

const router = Router();

router.get(
  "/search/:name",
  user.authentication,
  user.permission(PermissionBits.SEARCH),
  controller.searchRecord
);

router.post(
  "/upload",
  user.authentication,
  user.permission(PermissionBits.MANAGE_DATABASE),
  middleware.validateSchema.zod(uploadDonorRecordsValidate),
  controller.uploadRecords
);

router.get(
  "/export",
  user.authentication,
  user.permission(PermissionBits.MANAGE_DATABASE),
  controller.exportRecords
);

export default router;
