import { Router } from "express";
import middleware from "@xzihnago/middleware";
import { user } from "@/middleware";
import { updateDonorRelationValidate } from "./validates";
import { updateDonorRelationship } from "./controller";

const router = Router();

router.post(
  "/",
  middleware.authentication.jwt(process.env.HMAC_SECRET ?? ""),
  middleware.validateSchema.zod(updateDonorRelationValidate),
  user.parse,
  user.permission,
  user.keepUp,
  async (req, res, next) => {
    await updateDonorRelationship(req.body as never)
      .then((data) => {
        res.json(data);
      })
      .catch((error: unknown) => {
        next(error);
      });
  }
);

export default router;
