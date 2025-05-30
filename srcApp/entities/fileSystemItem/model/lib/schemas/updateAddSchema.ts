import * as z from "zod";

export const folderUpdateSchema = z.object({
  folderName: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "Folder name must be a non-empty string",
    }),
  isPublic: z.boolean(),
});
