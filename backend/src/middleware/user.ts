import jwt from "jsonwebtoken";

export const authentication: Middleware = (req, res, next) => {
  // Validate token
  const tokenC = (req.signedCookies as { token?: string }).token;
  if (!tokenC) {
    res.status(401);
    throw new Error("Token is required");
  }

  try {
    req.user = jwt.verify(tokenC, process.env.JWT_SECRET ?? "") as never;
  } catch (error) {
    res.status(401);
    throw error;
  }

  // Rolling token
  const tokenN = jwt.sign(
    { username: req.user.username, permissions: req.user.permissions },
    process.env.JWT_SECRET ?? "",
    { expiresIn: 10 * 60 }
  );
  res.cookie("token", tokenN, {
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
