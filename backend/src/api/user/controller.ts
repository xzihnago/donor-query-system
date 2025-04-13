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

  const token = jwt.sign(
    { username: user.username, permissions: user.permissions },
    process.env.JWT_SECRET ?? "",
    { expiresIn: 600 }
  );
  res.cookie("token", token, {
    signed: true,
    httpOnly: true,
    secure: true,
  });

  res.end();
};

export const logout: RequestHandler = (_, res) => {
  res.clearCookie("token").end();
};
