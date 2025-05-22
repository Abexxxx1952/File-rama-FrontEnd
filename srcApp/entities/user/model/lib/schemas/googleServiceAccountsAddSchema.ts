import * as z from "zod";

export const googleServiceAccountsAddSchema = z.object({
  clientEmail: z
    .string()
    .refine((value) => value.length >= 5 && value.includes("@"), {
      message: "Client email must be a valid email address",
    }),

  privateKey: z.string().refine((value) => value, {
    message: "Private key must be a string",
  }),

  rootFolderId: z.string().optional(),
});
