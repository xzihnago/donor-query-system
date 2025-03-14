import { z } from "zod";

export const loginUserValidate = z.object({
  username: z.string(),
  password: z.string(),
});
