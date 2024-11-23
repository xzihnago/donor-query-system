import type { User } from "@prisma/client";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const parse: Middleware = async (req, _, next) => {
  const username = (req.jwt.decoded as { username: string }).username;

  req.user = await prisma.user.findUniqueOrThrow({
    where: {
      username,
    },
  });

  next();
};

const permission: Middleware = (req, res, next) => {
  if (!req.user.admin) {
    res.status(403);
    next(new Error("權限不足"));
    return;
  }

  next();
};

const keepUp: Middleware = async (req, res, next) => {
  if (Date.now() - req.user.updatedAt.getTime() > 10 * 60 * 1000) {
    res.status(401);
    next(new Error("登入已過期，請重新登入"));
    return;
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

const user = { parse, permission, keepUp };

export default user;
