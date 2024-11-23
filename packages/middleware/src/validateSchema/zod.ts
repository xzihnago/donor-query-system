import type { Schema } from "zod";

export const zod: Middleware<[schema: Schema<unknown>]> =
  (schema) => (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
    } catch (error) {
      res.status(422);
      next(error);
      return;
    }

    next();
  };
