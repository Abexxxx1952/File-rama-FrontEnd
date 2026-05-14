import * as z from "zod";

export const fileUpdateSchema = z.object({
  fileName: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "File name must be a non-empty string",
    }),
  fileExtension: z.string().transform((val) => val.trim()),
  isPublic: z.boolean(),
  canRewritten: z.boolean(),
  fileGDriveUrl: z.string(),
  fileStaticUrl: z.string(),
});
