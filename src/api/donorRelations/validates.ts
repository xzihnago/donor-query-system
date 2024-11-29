import { z } from "zod";

export const updateDonorRelationsValidate = z.object({
  superior: z.string(),
  inferior: z.string(),
});
