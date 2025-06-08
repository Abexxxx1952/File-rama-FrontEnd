import * as z from "zod";

export const fileUpdateSchema = z.object({
  fileName: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "File name must be a non-empty string",
    }),
  isPublic: z.boolean(),
});
