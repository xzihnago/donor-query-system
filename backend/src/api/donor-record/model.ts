export const sumRecordByName = async (name: string) => {
  const data = await prisma.donor.findRefTree(name);
  if (!data) return null;

  const total = data.reduce(
    (acc, donor) =>
      acc + donor.records.reduce((acc, record) => acc + record.amount, 0),
    0
  );

  return total;
};

export const uploadRecordByTuple = async ([name, amounts]: [
  string,
  number[],
]) => {
  const donor = await prisma.donor.upsert({
    where: { name },
    create: { name },
    update: {},
    select: { id: true },
  });

  const data = amounts.map((amount) => ({
    donorId: donor.id,
    amount,
  }));

  await prisma.donationRecord.createMany({
    data,
  });
};

export const findAllDonorName = () =>
  prisma.donor.findMany({
    select: { name: true },
  });
