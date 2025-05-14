import { z } from "zod";

export const uploadSchema = z.tuple([z.string(), z.number()]).array();
