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
