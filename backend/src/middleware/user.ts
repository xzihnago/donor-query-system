import type { User } from "@prisma/client";
import { middleware } from "@xzihnago/express-utils";

export const auth: Middleware = (req, res, next) => {
  const token = (req.signedCookies as { token?: string }).token;
  if (!token) {
    res.status(401);
    throw new Error("Token not found");
  }

  return middleware.authentication.jwt(token, process.env.JWT_SECRET ?? "")(
    req,
    res,
    next
  );
};

export const parse: Middleware = async (req, _, next) => {
  const username = (req.jwt?.payload as { username: string }).username;
  req.user = await prisma.user.findUniqueOrThrow({
    where: {
      username,
    },
  });

  next();
};

export const permission: Middleware<[flag: PermissionBits]> =
  (flag) => (req, res, next) => {
    if ((req.user.permissions & flag) !== (flag as number)) {
      res.status(403);
      throw new Error("Permission denied");
    }

    next();
  };

export const keepUp: Middleware = async (req, res, next) => {
  if (Date.now() - req.user.updatedAt.getTime() > 10 * 60 * 1000) {
    res.status(401);
    throw new Error("Token expired");
  }

  await prisma.user.update({
    where: {
      username: req.user.username,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  next();
};

export enum PermissionBits {
  SEARCH = 1,
  EDIT_RELATION = 2,
  MANAGE_DATABASE = 4,
}

declare module "express-serve-static-core" {
  interface Request {
    user: User;
  }
}
