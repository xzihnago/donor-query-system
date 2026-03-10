import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        name: err.name,
        message: err.message,
        cause: err.cause,
      },
      err.status,
    );
  } else {
    console.error(err);
    return c.json(
      {
        name: "InternalServerError",
        message: "An unexpected error occurred.",
        cause: err.cause ?? `${err.name}: ${err.message}`,
      },
      500,
    );
  }
};
