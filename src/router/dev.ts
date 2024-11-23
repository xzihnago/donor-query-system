import crypto from "crypto";
import { Router } from "express";
import { z } from "zod";
import middleware from "@xzihnago/middleware";

const router = Router();

router.delete(
  "/drop",
  middleware.authentication.local,
  async (_, res, next) => {
    try {
      await prisma.donationRecord.deleteMany();
      await prisma.donor.deleteMany();
      res.end();
    } catch (error: unknown) {
      res.status(500);
      next(error);
    }
  }
);

router.get("/count", middleware.authentication.local, async (_, res) => {
  const user = await prisma.user.count();
  const donor = await prisma.donor.count();
  const donationRecord = await prisma.donationRecord.count();

  res.json({
    user,
    donor,
    donationRecord,
  });
});

const upsertUserValidate = z.object({
  admin: z.boolean().optional(),
  username: z.string(),
  password: z.string(),
});

router.post(
  "/user",
  middleware.authentication.local,
  middleware.validateSchema.zod(upsertUserValidate),
  async (req, res, next) => {
    const data = req.body as z.infer<typeof upsertUserValidate>;

    const passwordHash = crypto
      .createHmac("sha256", process.env.HMAC_SECRET ?? "")
      .update(data.password)
      .digest("hex");

    await prisma.user
      .upsert({
        where: {
          username: data.username,
        },
        create: {
          admin: data.admin,
          username: data.username,
          passwordHash,
        },
        update: {
          admin: data.admin,
          passwordHash,
        },
      })
      .then((data) => res.json(data))
      .catch((error: unknown) => {
        next(error);
      });
  }
);

router.delete(
  "/user/:name",
  middleware.authentication.local,
  async (req, res, next) => {
    await prisma.user
      .delete({
        where: {
          username: req.params.name,
        },
      })
      .then((data) => res.json(data))
      .catch((error: unknown) => {
        next(error);
      });
  }
);

export default router;
