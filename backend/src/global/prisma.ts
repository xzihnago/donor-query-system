import { PrismaClient } from "@prisma/client";

const findRefTree = async (name: string) => {
  const include = {
    records: {
      select: {
        amount: true,
      },
    },
    superior: {
      select: {
        id: true,
        name: true,
      },
    },
    inferiors: {
      select: {
        id: true,
      },
    },
  };

  const root = await prisma.donor.findUnique({
    where: { name },
    include,
  });
  if (!root) return null;

  // BFS
  const data = [root];

  const visited: string[] = [];
  let index = 0;
  while (index < data.length) {
    const current = data[index++];

    if (visited.includes(current.name)) {
      continue;
    }
    visited.push(current.name);

    const children = await Promise.all(
      current.inferiors.map((child) =>
        prisma.donor.findUniqueOrThrow({
          where: { id: child.id },
          include,
        })
      )
    );

    data.push(...children);
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
