import type { RequestHandler } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { loginUserValidate } from "./validates";

export const login: RequestHandler = async (req, res) => {
  const data = req.body as z.infer<typeof loginUserValidate>;

  const passwordHash = crypto
    .createHmac("sha256", process.env.HMAC_SECRET ?? "")
    .update(data.password)
    .digest("hex");

  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (!user || user.passwordHash !== passwordHash) {
    res.status(401);
    throw new Error("無效的使用者名稱或密碼");
  }

  await prisma.user.update({
    where: {
      username: data.username,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  const token = jwt.sign(
    { username: user.username },
    process.env.HMAC_SECRET ?? ""
  );

  res
    .cookie("token", token, {
      signed: true,
      httpOnly: true,
      secure: true,
    })
    .end();
};

export const logout: RequestHandler = (_, res) => {
  res.clearCookie("token").end();
};
