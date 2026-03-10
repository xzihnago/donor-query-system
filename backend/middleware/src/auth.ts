import type { Env } from "@dqs/common";
import { env } from "hono/adapter";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { createMiddleware } from "hono/factory";
import { verify, sign } from "hono/jwt";

export const authentication = createMiddleware<Env & EnvVariables>(
  async (c, next) => {
    const SECRET = env(c).JWT_SECRET;

    // Validate
    const tokenAccess = await getSignedCookie(c, SECRET, "token");
    if (!tokenAccess) {
      throw new HTTPException(401, {
        message: "Unauthorized",
        cause: "No token provided",
      });
    }

    try {
      const payload = await verify(tokenAccess, SECRET, "HS256");
      c.set("user", payload as unknown as User);
    } catch {
      throw new HTTPException(401, {
        message: "Unauthorized",
        cause: "Invalid token",
      });
    }

    // Rolling
    const user = c.get("user");
    const tokenRefresh = await sign(
      {
        exp: Math.floor(Date.now() / 1000) + 10 * 60, // 10 minutes
        username: user.username,
        permissions: user.permissions,
      },
      SECRET,
    );

    await setSignedCookie(c, "token", tokenRefresh, SECRET, {
      httpOnly: true,
      secure: true,
    });

    await next();
  },
);

export const permission = (flag: PermissionBits) =>
  createMiddleware<Env & EnvVariablesPartial>(async (c, next) => {
    const user = c.get("user");
    if (!user) {
      throw new HTTPException(401, {
        message: "Unauthorized",
        cause: "No user information",
      });
    }
    if ((user.permissions & flag) !== (flag as number)) {
      throw new HTTPException(403, {
        message: "Permission denied",
        cause: "Insufficient permissions",
      });
    }

    await next();
  });

export enum PermissionBits {
  SEARCH = 1,
  EDIT_RELATION = 2,
  MANAGE_DATABASE = 4,
}

interface User {
  username: string;
  permissions: PermissionBits;
}

interface EnvVariables {
  Variables: {
    user: User;
  };
}

interface EnvVariablesPartial {
  Variables: {
    user?: User;
  };
}
