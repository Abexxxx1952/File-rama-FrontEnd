import { loginFormError } from "./types/loginFormError";

export function transformZodErrors(zodErrors: {
  email?: string[];
  password?: string[];
}): Partial<loginFormError> {
  const errors: Partial<loginFormError> = {};
  if (zodErrors.email) {
    errors.email = zodErrors.email[0];
  }
  if (zodErrors.password) {
    errors.password = zodErrors.password[0];
  }
  return errors;
}
