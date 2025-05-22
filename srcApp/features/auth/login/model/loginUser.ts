import { Dispatch, SetStateAction } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "@/srcApp/entities/user/model/types/user";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { toast } from "react-toastify";
import { fetchLoginUser } from "../api/fetchLoginUser";
import { validationSchema } from "../lib/schema";
import { transformZodErrors } from "./transformZodErrors";
import { UserLoginFormData } from "./types/userWithTokens";

export async function loginUser(
  email: string,
  password: string,
  setErrors: Dispatch<SetStateAction<Partial<UserLoginFormData>>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
) {
  const validationResult = validationSchema.safeParse({ email, password });

  if (!validationResult.success) {
    setErrors(
      transformZodErrors(validationResult.error.formErrors.fieldErrors),
    );

    return;
  }

  setLoading(true);

  try {
    const response = await fetchLoginUser(email, password);

    if (isErrorData(response)) {
      throw response;
    }

    notifyResponse<User>(
      response,
      false,
      `Successfully logged ${response.email}`,
    );

    router.push("/dashboard");
  } catch (error) {
    if (isErrorData(error)) {
      toast.error(
        `Error: ${error.status || error.statusCode} ${
          error.statusText || error.error
        }. Massage: ${JSON.stringify(error.message)}`,
        {
          position: "top-right",
        },
      );
      return;
    }
    toast.error("An unexpected error occurred.", {
      position: "top-right",
    });
  } finally {
    setLoading(false);
  }
}
