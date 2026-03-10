import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { openapi } from "@dqs/common";

export const sum = describeRoute({
  tags: ["Donors Records"],
  summary: "Sum donation records",
  description: "Sum donation records of donors",
  responses: {
    200: openapi.successResponse(z.number()),
    401: openapi.unauthorizedResponse,
    403: openapi.forbiddenResponse,
    404: openapi.notFoundResponse,
  },
});

export const upload = describeRoute({
  tags: ["Donors Records"],
  summary: "Upload donation records",
  description: "Upload donation records in bulk",
  responses: {
    200: openapi.successResponse(z.number()),
    400: openapi.badRequestResponse,
    401: openapi.unauthorizedResponse,
    403: openapi.forbiddenResponse,
    422: openapi.unprocessableContentResponse,
  },
});

export const list = describeRoute({
  tags: ["Donors Records"],
  summary: "Get donors list",
  description: "Get a list of all donors and their total donations",
  responses: {
    200: openapi.successResponse(z.tuple([z.string(), z.number()]).array()),
    401: openapi.unauthorizedResponse,
    403: openapi.forbiddenResponse,
  },
});
