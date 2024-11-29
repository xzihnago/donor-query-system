import type { RequestHandler } from "express";
import xlsx from "node-xlsx";

export const searchRecords: RequestHandler = async (req, res) => {
  const data = await prisma.donor.findRefTree(req.params.name);

  if (!data) {
    res.status(404);
    throw new Error(`「${req.params.name}」不存在`);
  }

  const amount = data.reduce(
    (acc, donor) =>
      acc + donor.records.reduce((acc, record) => acc + record.amount, 0),
    0
  );

  res.ok(amount);
};

export const uploadRecords: RequestHandler = async (req, res) => {
  if (!req.files?.records) {
    res.status(400);
    throw new Error("無檔案");
  }

  const files = Array.isArray(req.files.records)
    ? req.files.records
    : [req.files.records];

  const tasks = files.map(async (file) => {
    const records = xlsx.parse(file.data);
    const headers = records[0].data[0];
    const contents = records[0].data.slice(1);

    const nameIndex = headers.indexOf("供養者");
    const amountIndex = headers.indexOf("金額");

    // Check if required tags are present
    const missing = [];
    if (nameIndex === -1) missing.push("供養者");
    if (amountIndex === -1) missing.push("金額");
    if (missing.length > 0) {
      return `錯誤：（${file.name}）\n    缺少標頭：${missing.join("、")}`;
    }

    // Check if all required fields are present
    const data = new Proxy({} as Record<string, number[]>, {
      get: (target, p: string) => (target[p] ??= []),
    });

    const errors: string[] = [];
    contents.forEach((record, index) => {
      const name = record[nameIndex] as string;
      const amount = record[amountIndex] as number;

      const missing = [];
      if (typeof name !== "string") missing.push("供養者");
      if (typeof amount !== "number") missing.push("金額");
      if (missing.length > 0) {
        if (missing.length === 1) {
          errors.push(
            `    缺少欄位：第 ${(index + 2).toFixed()} 列（${missing[0]}）`
          );
        }
        return;
      }

      data[name].push(amount);
    });

    if (errors.length > 0) {
      return `錯誤：（${file.name}）\n` + errors.join("\n");
    }

    // Insert data
    await Promise.all(
      Object.entries(data).map(async ([name, amounts]) => {
        const donor = await prisma.donor.upsert({
          where: { name },
          create: { name },
          update: {},
        });

        const data = amounts.map((amount) => ({
          donorId: donor.id,
          amount,
        }));

        await prisma.donationRecord.createMany({
          data,
        });
      })
    );

    return `成功：匯入 ${contents.length.toFixed()} 筆資料（${file.name}）`;
  });

  const messages = await Promise.all(tasks);

  res.ok(messages.join("\n"));
};

export const exportRecords: RequestHandler = async (_, res) => {
  const donors = await prisma.donor.findMany({
    include: { records: true, inferiors: true },
  });

  const data = await Promise.all(
    donors.map(async (donor) => {
      const data = await prisma.donor.findRefTree(donor.name);

      const amount = data?.reduce(
        (acc, donor) =>
          acc + donor.records.reduce((acc, record) => acc + record.amount, 0),
        0
      );

      return [donor.name, amount];
    })
  );

  const buffer = xlsx.build([
    {
      name: "總計表",
      data: [["供養者", "金額"], ...data],
      options: {},
    },
  ]);

  res
    .contentType(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    .send(buffer);
};
