import type { RequestHandler } from "express";
import type { z } from "zod";
import { uploadDonorRecordsValidate } from "./validates";

export const searchRecords: RequestHandler = async (req, res) => {
  const data = await prisma.donor
    .findRefTreeOrThrow(req.params.name)
    .catch(() => {
      res.status(404);
      throw new Error(req.params.name);
    });

  const amount = data.reduce(
    (acc, donor) =>
      acc + donor.records.reduce((acc, record) => acc + record.amount, 0),
    0
  );

  res.ok(amount);
};

export const uploadRecords: RequestHandler = async (req, res) => {
  const data = req.body as z.infer<typeof uploadDonorRecordsValidate>;

  const nameMap = new Proxy<Record<string, number[]>>(
    {},
    {
      get: (target, p: string) => (target[p] ??= []),
    }
  );
  data.forEach((record) => nameMap[record[0]].push(record[1]));

  const tasks = Object.entries(nameMap).map(([name, amounts]) =>
    prisma.donor
      .upsert({
        where: { name },
        create: { name },
        update: {},
      })
      .then((donor) =>
        prisma.donationRecord.createMany({
          data: amounts.map((amount) => ({
            donorId: donor.id,
            amount,
          })),
        })
      )
  );
  await Promise.all(tasks);

  res.ok(data.length);
};

export const exportRecords: RequestHandler = async (_, res) => {
  const donors = await prisma.donor.findMany({
    include: { records: true },
  });

  const tasks = donors.map(async (donor) => {
    const data = await prisma.donor.findRefTreeOrThrow(donor.name);
    const amount = data.reduce(
      (acc, donor) =>
        acc + donor.records.reduce((acc, record) => acc + record.amount, 0),
      0
    );

    return [donor.name, amount];
  });
  const data = await Promise.all(tasks);

  res.ok(data);
};
