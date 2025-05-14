import type { RequestHandler } from "express";
import type { z } from "zod";
import type { uploadSchema } from "./schemas";
import * as model from "./model";

export const sumRecord: RequestHandler<{ name: string }> = async (req, res) => {
  const data = await model.sumRecordByName(req.params.name);
  if (!data) {
    res.status(404);
    throw new Error(req.params.name);
  }

  res.ok(data);
};

export const uploadRecord: RequestHandler<
  unknown,
  unknown,
  z.infer<typeof uploadSchema>
> = async (req, res) => {
  const nameMap = new Proxy<Record<string, number[]>>(
    {},
    {
      get: (target, p: string) => (target[p] ??= []),
    }
  );
  req.body.forEach((record) => nameMap[record[0]].push(record[1]));

  const tasks = Object.entries(nameMap).map(model.uploadRecordByTuple);
  await Promise.all(tasks);

  res.ok(req.body.length);
};

export const exportRecord: RequestHandler = async (_, res) => {
  const donors = await model.findAllDonorName();

  const tasks = donors.map(async ({ name }) => {
    const total = await model.sumRecordByName(name);
    return [name, total];
  });
  const data = await Promise.all(tasks);

  res.ok(data);
};
