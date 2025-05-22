import * as z from "zod";

export const userUpdateSchema = z
  .object({
    name: z
      .string()
      .optional()
      .refine((value) => !value || value.length >= 2, {
        message: "Name must be at least 2 characters",
      }),
    password: z
      .string()
      .optional()
      .refine((value) => !value || value.length >= 2, {
        message: "Password must be at least 2 characters",
      }),
    repeatPassword: z
      .string()
      .optional()
      .refine((value) => !value || value.length >= 2, {
        message: "Must match the 'Password' field",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.password) {
      if (!data.repeatPassword) {
        ctx.addIssue({
          path: ["repeatPassword"],
          code: z.ZodIssueCode.custom,
          message: "Repeat password is required when changing password",
        });
      } else if (data.password !== data.repeatPassword) {
        ctx.addIssue({
          path: ["repeatPassword"],
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
        });
      }
    }
  });
