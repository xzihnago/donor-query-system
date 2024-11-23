import { z } from "zod";

export const updateDonorRelationValidate = z.object({
  name: z.string(),
  relations: z.array(z.string()),
});
