import { z } from "zod";

export const login = z
  .strictObject({
    username: z.string().meta({
      description: "The user's username",
    }),
    password: z.string().meta({
      description: "The user's password",
    }),
  })
  .meta({
    example: {
      username: "username",
      password: "password",
    },
  });
