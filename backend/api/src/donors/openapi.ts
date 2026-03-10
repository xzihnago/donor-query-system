import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { openapi } from "@dqs/common";

export const cleanup = describeRoute({
  tags: ["Donors"],
  summary: "Cleanup database",
  description: "Cleanup donation records and donors that have no relations",
  responses: {
    200: openapi.successResponse(
      z.object({ donors: z.number(), records: z.number() }),
    ),
    401: openapi.unauthorizedResponse,
    403: openapi.forbiddenResponse,
  },
});
