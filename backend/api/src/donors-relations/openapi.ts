import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { openapi } from "@dqs/common";

export const get = describeRoute({
  tags: ["Donors Relations"],
  summary: "Get donors relations",
  description: "Get the relationships between donors",
  responses: {
    200: openapi.successResponse(z.array(z.tuple([z.string(), z.string()]))),
    401: openapi.unauthorizedResponse,
    403: openapi.forbiddenResponse,
    404: openapi.notFoundResponse,
  },
});

export const update = describeRoute({
  tags: ["Donors Relations"],
  summary: "Update donor relation",
  description: "Update the relationship of a donor",
  responses: {
    200: openapi.emptyResponse,
    400: openapi.badRequestResponse,
    401: openapi.unauthorizedResponse,
    403: openapi.forbiddenResponse,
    404: openapi.notFoundResponse,
    422: openapi.unprocessableContentResponse,
  },
});
