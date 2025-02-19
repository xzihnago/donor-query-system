import type { RequestHandler } from "express";
import { z } from "zod";
import { updateDonorRelationsValidate } from "./validates";

export const findRelations: RequestHandler = async (req, res) => {
  const data = await prisma.donor
    .findRefTreeOrThrow(req.params.name)
    .catch(() => {
      res.status(404);
      throw new Error(req.params.name);
    });

  res.ok(
    data.map((donor) =>
      donor.superior ? [donor.superior.name, donor.name] : [donor.name]
    )
  );
};

export const addRelations: RequestHandler = async (req, res) => {
  const data = req.body as z.infer<typeof updateDonorRelationsValidate>;

  const superior = await prisma.donor
    .findUniqueOrThrow({
      where: { name: data.superior },
    })
    .catch(() => {
      res.status(404);
      throw new Error(data.superior);
    });

  await prisma.donor
    .update({
      where: { name: data.inferior },
      data: {
        superiorId: superior.id,
      },
    })
    .catch(() => {
      res.status(404);
      throw new Error(data.inferior);
    });

  res.end();
};

export const removeRelations: RequestHandler = async (req, res) => {
  const donor = await prisma.donor
    .findUniqueOrThrow({
      where: { name: req.params.name },
      include: {
        inferiors: true,
      },
    })
    .catch(() => {
      res.status(404);
      throw new Error(req.params.name);
    });

  await prisma.donor.update({
    where: { name: donor.name },
    data: {
      superiorId: null,
    },
  });

  res.end();
};
