import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { openapi } from "@dqs/common";

export const getMe = describeRoute({
  tags: ["Users"],
  summary: "Get current user info",
  description: "Get the username and permissions of the current user",
  responses: {
    200: openapi.successResponse(z.object({ permissions: z.number() })),
    401: openapi.unauthorizedResponse,
  },
});

export const login = describeRoute({
  tags: ["Users"],
  summary: "User login",
  description: "Login with username and password",
  responses: {
    200: openapi.emptyResponse,
    401: openapi.unauthorizedResponse,
    422: openapi.unprocessableContentResponse,
  },
});

export const logout = describeRoute({
  tags: ["Users"],
  summary: "User logout",
  description: "Logout the current user",
  responses: {
    200: openapi.emptyResponse,
  },
});
