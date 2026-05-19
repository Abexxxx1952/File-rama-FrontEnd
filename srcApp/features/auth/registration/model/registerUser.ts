import { type Dispatch, type SetStateAction } from "react";

import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { type User } from "@/srcApp/entities/user/model/types/user";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { type ErrorData } from "@/srcApp/shared/model/types/errorData";

import { fetchRegisterUser } from "../api/fetchRegisterUser";
import { type CreateUser } from "./types/createUser";

export async function registerUser(
  registerData: CreateUser,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance
): Promise<void> {
  setLoading(true);

  try {
    const data: User | ErrorData | null = await fetchRegisterUser(registerData);

    if (isErrorData(data)) {
      notifyResponse({
        isError: true,
        responseResult: data,
      });
      return;
    }

    if (data === null) {
      notifyResponse({
        isError: true,
        responseResult: null,
      });
      return;
    }
    notifyResponse({
      isError: false,
      successMessage: `User ${registerData.email} register successfully`,
    });
    router.replace("/login");
  } catch (error) {
    console.warn("error", error);
  } finally {
    setLoading(false);
  }
}
