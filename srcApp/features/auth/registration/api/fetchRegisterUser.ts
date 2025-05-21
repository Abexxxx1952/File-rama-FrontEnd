"use server";

import { User } from "@/srcApp/entities/user/model/types/user";
import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types";
import { CreateUser } from "../model/types/createUser";

export async function fetchRegisterUser(
  registerData: CreateUser,
): Promise<User | ErrorData> {
  const url: string = `${process.env.REGISTER_URL}`;

  const createData: CreateUser = {
    email: registerData.email,
    password: registerData.password,
    passwordRepeat: registerData.passwordRepeat,
  };

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "POST",
    bodyData: createData,
  };

  try {
    const response = await apiClient(apiClientParams);

    if (!response?.ok) {
      const errorData: ErrorData = await response.json();

      return errorData;
    }

    const data: User = await response.json();

    return data;
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    throw error;
  }
}
