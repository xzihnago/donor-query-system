import { Router } from "express";
import middleware from "@xzihnago/middleware";
import { loginUserValidate } from "./validates";
import { login } from "./controller";

const router = Router();

router.post(
  "/login",
  middleware.validateSchema.zod(loginUserValidate),
  async (req, res, next) => {
    await login(req.body as never)
      .then((data) =>
        res
          .cookie("token", data.token, {
            signed: true,
            httpOnly: true,
            secure: true,
          })
          .end()
      )
      .catch((error: unknown) => {
        res.status(401);
        next(error);
      });
  }
);

router.get("/logout", (_, res) => {
  res.clearCookie("token").end();
});

export default router;
