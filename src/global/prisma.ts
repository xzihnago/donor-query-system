import { PrismaClient } from "@prisma/client";

const findRefTree = async (name: string) => {
  const root = await prisma.donor.findUnique({
    where: { name },
    include: {
      records: true,
      superior: true,
      inferiors: true,
    },
  });

  if (!root) return null;

  const data = [root];

  // BFS
  const visited: string[] = [];
  let index = 0;
  while (index < data.length) {
    const current = data[index];

    if (!visited.includes(current.name)) {
      visited.push(current.name);

      for (const inferior of current.inferiors) {
        data.push(
          await prisma.donor.findUniqueOrThrow({
            where: { id: inferior.id },
            include: {
              records: true,
              superior: true,
              inferiors: true,
            },
          })
        );
      }
    }

    index++;
  }

  return data;
};

export const prisma = new PrismaClient().$extends({
  name: "findRefTree",
  model: {
    donor: {
      findRefTree,
    },
  },
});
