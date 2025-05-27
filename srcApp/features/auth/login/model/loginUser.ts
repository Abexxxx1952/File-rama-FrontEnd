import { Dispatch, SetStateAction } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "@/srcApp/entities/user/model/types/user";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { fetchLoginUser } from "../api/fetchLoginUser";
import { validationSchema } from "../lib/schema";
import { transformZodErrors } from "./transformZodErrors";
import { loginFormError } from "./types/loginFormError";

export async function loginUser(
  email: string,
  password: string,
  setErrors: Dispatch<SetStateAction<Partial<loginFormError>>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
): Promise<void | null> {
  const validationResult = validationSchema.safeParse({ email, password });

  if (!validationResult.success) {
    setErrors(
      transformZodErrors(validationResult.error.formErrors.fieldErrors),
    );

    return;
  }

  setLoading(true);

  try {
    const data: User | ErrorData | null = await fetchLoginUser(email, password);

    if (isErrorData(data)) {
      notifyResponse({
        isError: true,
        responseResult: data,
      });

      return null;
    }

    if (data === null) {
      notifyResponse({
        isError: true,
        responseResult: null,
      });
      return null;
    }

    notifyResponse({
      isError: false,
      successMessage: `Successfully logged ${data.email}`,
    });

    router.push("/dashboard");
  } catch (error) {
    console.log("error", error);
    return null;
  } finally {
    setLoading(false);
  }
}
