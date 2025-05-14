export const deleteDataWithNoRelations = async () => {
  const records = await prisma.donationRecord.deleteMany();
  const donors = await prisma.donor.deleteMany({
    where: {
      superior: null,
      inferiors: { none: {} },
    },
  });

  return {
    donors: donors.count,
    records: records.count,
  };
};
