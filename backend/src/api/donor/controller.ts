import type { RequestHandler } from "express";
import * as model from "./model";

export const deleteDonors: RequestHandler = async (_, res) => {
  const result = await model.deleteDataWithNoRelations();

  res.ok(result);
};
