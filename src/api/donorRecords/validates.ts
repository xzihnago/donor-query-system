import { z } from "zod";

export const uploadDonorRecordsValidate = z
  .tuple([z.string(), z.number()])
  .array();
