import type { UploadedFile } from "express-fileupload";
import xlsx from "node-xlsx";

export const searchRecords = async (name: string) => {
  const donor = await prisma.donor.findUnique({
    where: { name },
    include: {
      records: true,
      members: true,
    },
  });

  if (!donor) {
    throw new Error("功德主不存在");
  }

  // BFS
  let amount = 0;
  const members = [donor];
  const nameList: string[] = [];
  while (members.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const donor = members.shift()!;

    // Check reference cycle
    if (nameList.includes(donor.name)) {
      continue;
    }
    nameList.push(donor.name);

    amount += donor.records.reduce((acc, record) => acc + record.amount, 0);

    for (const member of donor.members) {
      members.push(
        await prisma.donor.findUniqueOrThrow({
          where: { id: member.id },
          include: {
            records: true,
            members: true,
          },
        })
      );
    }
  }

  return amount;
};

export const uploadRecords = async (file: UploadedFile) => {
  const records = xlsx.parse(file.data);

  // Check if required tags are present
  const headers = records[0].data[0];
  const nameIndex = headers.indexOf("供養者");
  const amountIndex = headers.indexOf("金額");

  const missingTags = [];
  if (nameIndex === -1) missingTags.push("供養者");
  if (amountIndex === -1) missingTags.push("金額");
  if (missingTags.length > 0) {
    throw new Error(
      `失敗：（${file.name}）\n    缺少標頭：${missingTags.join("、")}`
    );
  }

  // Check if required fields are present
  const errors: string[] = [];
  const data = new Proxy({} as Record<string, number[]>, {
    get: (target, p: string) => (target[p] ??= []),
  });
  let length = 0;
  records[0].data.slice(1).forEach((record, index) => {
    const name = record[nameIndex] as string;
    const amount = record[amountIndex] as number;

    const missingFields = [];
    if (typeof name !== "string") missingFields.push("供養者");
    if (typeof amount !== "number") missingFields.push("金額");
    if (missingFields.length > 0) {
      if (missingFields.length === 1) {
        errors.push(
          `    缺少欄位：第 ${(index + 2).toFixed()} 列（${missingFields[0]}）`
        );
      }
      return;
    }

    data[name].push(amount);
    length++;
  });

  if (errors.length > 0) {
    throw new Error(`失敗：（${file.name}）\n` + errors.join("\n"));
  }

  // Insert data
  await Promise.all(
    Object.entries(data).map(([name, amount]) =>
      prisma.donor
        .upsert({
          where: { name },
          create: { name },
          update: {},
        })
        .then((donor) =>
          prisma.donationRecord.createMany({
            data: amount.map((amount) => ({
              donorId: donor.id,
              amount,
            })),
          })
        )
    )
  );

  return `成功：匯入 ${length.toFixed()} 筆資料（${file.name}）`;
};
