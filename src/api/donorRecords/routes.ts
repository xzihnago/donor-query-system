import { Router } from "express";
import middleware from "@xzihnago/middleware";
import { user } from "@/middleware";
import { searchRecords, uploadRecords } from "./controller";

const router = Router();

router.get(
  "/:name",
  middleware.authentication.jwt(process.env.HMAC_SECRET ?? ""),
  user.parse,
  user.keepUp,
  async (req, res, next) => {
    await searchRecords(req.params.name)
      .then((data) => {
        res.json(data);
      })
      .catch((error: unknown) => {
        next(error);
      });
  }
);

router.post(
  "/upload",
  middleware.authentication.jwt(process.env.HMAC_SECRET ?? ""),
  user.parse,
  user.permission,
  user.keepUp,
  async (req, res, next) => {
    if (!req.files?.records) {
      next(new Error("無檔案"));
      return;
    } else if (Array.isArray(req.files.records)) {
      const messages = await Promise.all(
        req.files.records.map((file) =>
          uploadRecords(file)
            .then((data) => data)
            .catch((error: unknown) => {
              if (error instanceof Error) {
                return error.message;
              }
              return `錯誤：未知（${file.name}）`;
            })
        )
      );

      res.json(messages.join("\n"));
    } else {
      await uploadRecords(req.files.records)
        .then((data) => {
          res.json(data);
        })
        .catch((error: unknown) => {
          next(error);
        });
    }
  }
);

export default router;
