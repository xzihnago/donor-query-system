import { z } from "zod";

export const updateSchema = z
  .object({
    superior: z.string().nullable().meta({
      description: "The superior donor of the donor",
    }),
  })
  .meta({
    example: {
      superior: "AAA",
    },
  });
