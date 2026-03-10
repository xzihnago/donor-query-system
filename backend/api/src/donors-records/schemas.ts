import { z } from "zod";

export const uploadSchema = z
  .tuple([z.string(), z.number()])
  .meta({
    title: "[string, number]",
  })
  .array()
  .meta({
    description:
      "An array of donor records, where each record is a tuple containing the donor's name and the amount donated.",
    example: [
      ["AAA", 100],
      ["BBB", 200],
    ],
  });
