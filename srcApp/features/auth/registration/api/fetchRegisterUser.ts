"use server";

import { type User } from "@/srcApp/entities/user/model/types/user";
import { apiClient, type apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { type ErrorData } from "@/srcApp/shared/model/types/errorData";

import { type CreateUser } from "../model/types/createUser";

export async function fetchRegisterUser(
  registerData: CreateUser
): Promise<User | ErrorData | null> {
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

      throw errorData;
    }

    const data: User = await response.json();

    return data;
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    console.error(error);
    return null;
  }
}
