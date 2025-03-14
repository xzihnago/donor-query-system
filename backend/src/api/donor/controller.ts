import type { RequestHandler } from "express";

export const deleteDonors: RequestHandler = async (_, res) => {
  const records = await prisma.donationRecord.deleteMany();
  const donors = await prisma.donor.deleteMany({
    where: {
      superior: null,
      inferiors: { none: {} },
    },
  });

  res.ok({
    donors: donors.count,
    records: records.count,
  });
};
