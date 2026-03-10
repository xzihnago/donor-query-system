import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

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
        }),
      ),
    );

    data.push(...children);
  }

  return data;
};

const connectionString =
  process.env.DATABASE_URL ??
  (() => {
    throw new Error("DATABASE_URL is not defined");
  })();

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter }).$extends({
  name: "findRefTree",
  model: {
    donor: {
      findRefTree,
    },
  },
});
