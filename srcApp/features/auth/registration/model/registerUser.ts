import { Dispatch, SetStateAction } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "@/srcApp/entities/user/model/types/user";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types";
import { fetchRegisterUser } from "../api/fetchRegisterUser";
import { CreateUser } from "./types/createUser";

export async function registerUser(
  registerData: CreateUser,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
): Promise<void> {
  setLoading(true);

  try {
    const data: User | ErrorData = await fetchRegisterUser(registerData);

    if (isErrorData(data)) {
      notifyResponse(data, true);
      return;
    }
    notifyResponse(
      data,
      false,
      `User ${registerData.email} register successfully`,
    );
    router.replace("/login");
  } catch (error) {
    console.log("error", error);
  } finally {
    setLoading(false);
  }
}
