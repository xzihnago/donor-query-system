import type { User } from "@prisma/client";
import middleware from "@xzihnago/middleware";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export const auth = middleware.authentication.jwt.bind(
  null,
  process.env.HMAC_SECRET ?? "",
  "token"
)();

export const parse: Middleware = async (req, _, next) => {
  const username = (req.jwt.decoded as { username: string }).username;

  req.user = await prisma.user.findUniqueOrThrow({
    where: {
      username,
    },
  });

  next();
};

export const permission: Middleware<[flag: number]> =
  (flag) => (req, res, next) => {
    if ((req.user.permissions & flag) !== flag) {
      res.status(403);
      throw new Error("權限不足");
    }

    next();
  };

export const keepUp: Middleware = async (req, res, next) => {
  if (Date.now() - req.user.updatedAt.getTime() > 10 * 60 * 1000) {
    res.status(401);
    throw new Error("登入已過期，請重新登入");
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
