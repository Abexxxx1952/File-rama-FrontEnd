import * as z from "zod";

export const userRegistrationSchema = z
  .object({
    email: z.string().email("Invalid email address"),

    password: z.string().refine((value) => !value || value.length >= 2, {
      message: "Password must be at least 2 characters",
    }),
    passwordRepeat: z.string().refine((value) => !value || value.length >= 2, {
      message: "Must match the 'Password' field",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password) {
      if (!data.passwordRepeat) {
        ctx.addIssue({
          path: ["passwordRepeat"],
          code: z.ZodIssueCode.custom,
          message: "Repeat password is required",
        });
      } else if (data.password !== data.passwordRepeat) {
        ctx.addIssue({
          path: ["passwordRepeat"],
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
        });
      }
    }
  });
