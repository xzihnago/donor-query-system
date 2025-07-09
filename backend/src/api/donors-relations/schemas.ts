import { z } from "zod";

export const updateSchema = z.object({
  superior: z.string().nullable(),
});
