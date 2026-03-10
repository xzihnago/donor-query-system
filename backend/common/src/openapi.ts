import { resolver } from "hono-openapi";
import { z } from "zod";

const dataResponse = (description: string, schema: z.ZodType) => ({
  description,
  content: {
    "application/json": {
      schema: resolver(schema),
    },
  },
});

export const successResponse = (schema: z.ZodType) =>
  dataResponse("Success", schema);

export const errorResponse = (description = "Error") => ({
  description,
  content: {
    "application/json": {
      schema: resolver(
        z.object({
          name: z.string(),
          message: z.string(),
        }),
      ),
    },
  },
});

export const emptyResponse = {
  description: "Success",
};

export const badRequestResponse = dataResponse(
  "Bad Request",
  z.object({
    name: z.string(),
    message: z.string(),
  }),
);

export const unauthorizedResponse = dataResponse(
  "Unauthorized",
  z.object({
    name: z.string(),
    message: z.string(),
    cause: z.string(),
  }),
);

export const forbiddenResponse = dataResponse(
  "Forbidden",
  z.object({
    name: z.string(),
    message: z.string(),
    cause: z.string(),
  }),
);

export const notFoundResponse = dataResponse(
  "Not Found",
  z.object({
    name: z.string(),
    message: z.string(),
    cause: z.string(),
  }),
);

export const unprocessableContentResponse = dataResponse(
  "Unprocessable Content",
  z.object({
    name: z.string(),
    message: z.string(),
    cause: z
      .union([
        z.object({
          expected: z.string(),
          code: z.string(),
          path: z.string().array(),
          message: z.string(),
        }),
        z.object({
          code: z.string(),
          keys: z.string().array(),
          path: z.string().array(),
          message: z.string(),
        }),
      ])
      .array(),
  }),
);
