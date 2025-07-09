import { Router } from "express";
import { PermissionBits, user } from "@/middleware";
import * as controller from "./controller";

const router = Router();

router.delete(
  "/",
  user.authentication,
  user.permission(PermissionBits.MANAGE_DATABASE),
  controller.deleteDonors
);

export default router;
