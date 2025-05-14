import type { RequestHandler } from "express";
import type { z } from "zod";
import type { updateSchema } from "./schemas";
import * as model from "./model";

export const findRelations: RequestHandler<{ name: string }> = async (
  req,
  res
) => {
  const data = await model.findRelationsByName(req.params.name);
  if (!data) {
    res.status(404);
    throw new Error(req.params.name);
  }

  const result = data.map((donor) => [donor.superior?.name, donor.name]);

  res.ok(result);
};

export const updateRelations: RequestHandler<
  { name: string },
  unknown,
  z.infer<typeof updateSchema>
> = async (req, res) => {
  const inferior = await model.findDonorByName(req.params.name);
  if (!inferior) {
    res.status(404);
    throw new Error(req.params.name);
  }

  let superiorId = null;
  if (req.body.superior) {
    const superior = await model.findDonorByName(req.body.superior);
    if (!superior) {
      res.status(404);
      throw new Error(req.body.superior);
    }

    superiorId = superior.id;
  }

  await model.updateRelationsByName(inferior.name, superiorId);

  res.end();
};
