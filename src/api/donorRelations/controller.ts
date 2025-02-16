import type { RequestHandler } from "express";
import { z } from "zod";
import { updateDonorRelationsValidate } from "./validates";

export const findRelations: RequestHandler = async (req, res) => {
  const data = await prisma.donor.findRefTree(req.params.name);

  if (!data) {
    res.status(404);
    throw new Error(`「${req.params.name}」不存在於資料庫中`);
  }

  const graph = ["graph TD"].concat(
    data.map((donor) =>
      donor.superior
        ? `${donor.superior.name.replace(/\s/g, "")}(${donor.superior.name}) --> ${donor.name.replace(/\s/g, "")}(${donor.name})`
        : `${donor.name.replace(/\s/g, "")}(${donor.name})`
    )
  );

  res.ok(graph.join("\n"));
};

export const updateRelations: RequestHandler = async (req, res) => {
  const data = req.body as z.infer<typeof updateDonorRelationsValidate>;

  const superior = await prisma.donor.findUnique({
    where: { name: data.superior },
  });

  if (!superior) {
    res.status(404);
    throw new Error(`「${data.superior}」不存在於資料庫中`);
  }

  const inferior = await prisma.donor.findUnique({
    where: { name: data.inferior },
  });

  if (!inferior) {
    res.status(404);
    throw new Error(`「${data.inferior}」不存在於資料庫中`);
  }

  await prisma.donor.update({
    where: { name: data.inferior },
    data: {
      superiorId: superior.id,
    },
  });

  res.end();
};

export const deleteRelations: RequestHandler = async (req, res) => {
  const donor = await prisma.donor.findUnique({
    where: { name: req.params.name },
    include: {
      inferiors: true,
    },
  });

  if (!donor) {
    res.status(404);
    throw new Error(`「${req.params.name}」不存在於資料庫中`);
  }

  await prisma.donor.update({
    where: { name: donor.name },
    data: {
      superiorId: null,
    },
  });

  res.end();
};
