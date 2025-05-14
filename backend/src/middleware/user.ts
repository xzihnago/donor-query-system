import jwt from "jsonwebtoken";

export const authentication: Middleware = (req, res, next) => {
  // Validate
  const tokenAccess = (req.signedCookies as { token?: string }).token;
  if (!tokenAccess) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  try {
    req.user = jwt.verify(tokenAccess, env.JWT_SECRET) as never;
  } catch (error) {
    res.status(401);
    throw error;
  }

  // Rolling
  const tokenRefresh = jwt.sign(
    { username: req.user.username, permissions: req.user.permissions },
    env.JWT_SECRET,
    { expiresIn: 10 * 60 }
  );

  res.cookie("token", tokenRefresh, {
    signed: true,
    httpOnly: true,
    secure: true,
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

export enum PermissionBits {
  SEARCH = 1,
  EDIT_RELATION = 2,
  MANAGE_DATABASE = 4,
}

declare module "express-serve-static-core" {
  interface Request {
    user: {
      username: string;
      permissions: PermissionBits;
    };
  }
}
