import { Router } from "express";
import { user } from "@/middleware";
import * as controller from "./controller";

const router = Router();

router.get(
  "/search/:name",
  user.auth,
  user.parse,
  user.keepUp,
  controller.searchRecords
);

router.post(
  "/upload",
  user.auth,
  user.parse,
  user.permission,
  user.keepUp,
  controller.uploadRecords
);

router.get(
  "/export",
  user.auth,
  user.parse,
  user.permission,
  user.keepUp,
  controller.exportRecords
);

export default router;
