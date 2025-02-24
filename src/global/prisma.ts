import { PrismaClient } from "@prisma/client";

const findRefTree = (name: string) =>
  findRefTreeOrThrow(name).catch(() => null);

const findRefTreeOrThrow = (name: string) =>
  prisma.donor
    .findUniqueOrThrow({
      where: { name },
      include,
    })
    .then(async (root) => {
      const data = [root];

      // BFS
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
    });

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

export const prisma = new PrismaClient().$extends({
  name: "findRefTree",
  model: {
    donor: {
      findRefTree,
      findRefTreeOrThrow,
    },
  },
});
