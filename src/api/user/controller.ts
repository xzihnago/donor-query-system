import crypto from "crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { loginUserValidate } from "./validates";

export const login = async (data: z.infer<typeof loginUserValidate>) => {
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
    process.env.HMAC_SECRET ?? ""
  );

  return { token };
};
