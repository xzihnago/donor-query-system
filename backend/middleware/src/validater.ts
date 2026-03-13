import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { ValidationTargets } from "hono";
import { HTTPException } from "hono/http-exception";
import { validator as _validator } from "hono-openapi";

export const validator = <
  T extends StandardSchemaV1,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  _validator(target, schema, (result) => {
    if (!result.success) {
      throw new HTTPException(422, {
        message: "Validation failed",
        cause: result.error,
      });
    }
  });
