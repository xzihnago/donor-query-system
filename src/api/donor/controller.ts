import type { RequestHandler } from "express";

export const deleteDonors: RequestHandler = async (_, res) => {
  const donorRecords = await prisma.donationRecord.deleteMany();
  const donors = await prisma.donor.deleteMany({
    where: {
      superior: null,
      inferiors: { none: {} },
    },
  });
  res.ok(
    [
      "成功刪除資料：",
      `捐款紀錄 ${donorRecords.count.toFixed()} 筆`,
      `捐款人 ${donors.count.toFixed()} 人`,
    ].join("\n")
  );
};
