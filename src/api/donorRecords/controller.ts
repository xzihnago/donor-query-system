import type { RequestHandler } from "express";
import xlsx from "node-xlsx";

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
  if (!req.files) {
    res.status(400);
    throw new Error("No files");
  }

  const files = Object.values(req.files)
    .map((value) => value)
    .flat();

  const tasks = files.map(async (file) => {
    let sheets;
    try {
      sheets = xlsx.parse(file.data);
    } catch {
      return {
        type: "INVALID_FILE",
        file: file.name,
      };
    }

    const [headers, contents] = [sheets[0].data[0], sheets[0].data.slice(1)];
    const indexes = [headers.indexOf("供養者"), headers.indexOf("金額")];

    // Check if required headers are present
    const missing = ["供養者", "金額"].filter((_, i) => indexes[i] === -1);
    if (missing.length > 0) {
      return {
        type: "MISSING_HEADER",
        file: file.name,
        error: missing,
      };
    }

    // Check if required fields are present
    const error: { line: number; missing: string[] }[] = [];
    const records = contents
      .map<[unknown, unknown, number]>((row, line) => [
        row[indexes[0]],
        row[indexes[1]],
        line,
      ])
      .filter((record): record is [string, number, number] => {
        const missing = ["供養者", "金額"].filter(
          (_, i) => typeof record[i] !== ["string", "number"][i]
        );

        if (missing.length === 1) {
          error.push({
            line: record[2] + 2,
            missing,
          });
        }

        return missing.length === 0;
      });

    if (error.length > 0) {
      return {
        type: "INVALID_DATA",
        file: file.name,
        error,
      };
    }

    // Insert data into database
    const nameMap = new Proxy<Record<string, number[]>>(
      {},
      {
        get: (target, p: string) => (target[p] ??= []),
      }
    );
    records.forEach((record) => nameMap[record[0]].push(record[1]));

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

    return {
      type: "SUCCESS",
      file: file.name,
      count: records.length,
    };
  });

  const data = await Promise.all(tasks);

  res.ok(data);
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
