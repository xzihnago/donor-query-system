import bcrypt from "bcrypt";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { setSignedCookie, deleteCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import * as middleware from "@dqs/middleware";
import * as openapi from "./openapi";
import * as schema from "./schemas";
import * as model from "./model";

const router = new Hono();

router.get("/@me", openapi.getMe, middleware.authentication, async (c) => {
  const user = await model.findUserInfoByUsername(c.get("user").username);
  return c.json(user);
});

router.post(
  "/login",
  openapi.login,
  middleware.validator("json", schema.login),
  async (c) => {
    const data = c.req.valid("json");
    const user = await model.findUserByUsername(data.username);
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new HTTPException(401, { message: "Invalid username or password" });
    }

    const SECRET = env<{ JWT_SECRET: string }>(c).JWT_SECRET;
    const token = await sign(
      {
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        username: data.username,
        permissions: user.permissions,
      },
      SECRET,
    );

    await setSignedCookie(c, "token", token, SECRET, {
      httpOnly: true,
      secure: true,
    });

    return c.body("");
  },
);

router.get("/logout", openapi.logout, (c) => {
  deleteCookie(c, "token");
  return c.body("");
});

export default router;
