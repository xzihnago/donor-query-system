import { Router } from "express";
import { PermissionBits, user } from "@/middleware";
import * as controller from "./controller";

const router = Router();

router.delete(
  "/",
  user.auth,
  user.parse,
  user.permission(PermissionBits.MANAGE_DATABASE),
  user.keepUp,
  controller.deleteDonors
);

export default router;
