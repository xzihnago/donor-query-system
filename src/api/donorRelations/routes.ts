import { Router } from "express";
import middleware from "@xzihnago/middleware";
import { user } from "@/middleware";
import { updateDonorRelationsValidate } from "./validates";
import * as controller from "./controller";

const router = Router();

router.get(
  "/:name",
  user.auth,
  user.parse,
  user.permission,
  user.keepUp,
  controller.findRelations
);

router.post(
  "/",
  user.auth,
  middleware.validateSchema.zod(updateDonorRelationsValidate),
  user.parse,
  user.permission,
  user.keepUp,
  controller.updateRelations
);

router.delete(
  "/:name",
  user.auth,
  user.parse,
  user.permission,
  user.keepUp,
  controller.deleteRelations
);

export default router;
