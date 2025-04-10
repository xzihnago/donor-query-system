import type { RequestHandler } from "express";
import type { z } from "zod";
import jwt from "jsonwebtoken";
import { utils } from "@xzihnago/express-utils";
import { loginUserValidate } from "./validates";

export const login: RequestHandler = async (req, res) => {
  const data = req.body as z.infer<typeof loginUserValidate>;

  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (
    !user ||
    !(await utils.password.bcrypt.verify(data.password, user.passwordHash))
  ) {
    res.status(401);
    throw new Error("Invalid username or password");
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
    process.env.JWT_SECRET ?? ""
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
