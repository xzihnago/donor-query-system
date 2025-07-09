export const findDonorByName = (name: string) =>
  prisma.donor.findUnique({
    where: {
      name,
    },
    select: {
      id: true,
      name: true,
      superiorId: true,
    },
  });

export const findRelationsByName = (name: string) =>
  prisma.donor.findRefTree(name);

export const updateRelationsByName = (
  name: string,
  superiorId: string | null
) =>
  prisma.donor.update({
    where: { name },
    data: {
      superiorId,
    },
  });
