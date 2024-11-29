import { Router } from "express";
import middleware from "@xzihnago/middleware";
import { loginUserValidate } from "./validates";
import * as controller from "./controller";

const router = Router();

router.post(
  "/login",
  middleware.validateSchema.zod(loginUserValidate),
  controller.login
);

router.get("/logout", controller.logout);

export default router;
