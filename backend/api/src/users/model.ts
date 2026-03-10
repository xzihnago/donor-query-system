import { prisma } from "@dqs/database";

export const findUserInfoByUsername = (username: string) =>
  prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      permissions: true,
    },
  });

export const findUserByUsername = (username: string) =>
  prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      permissions: true,
      passwordHash: true,
    },
  });
