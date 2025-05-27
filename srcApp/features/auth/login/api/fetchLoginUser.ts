"use server";

import { User } from "@/srcApp/entities/user/model/types/user";
import { setCookies } from "@/srcApp/features/cookies/model/setCookies";
import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";

export async function fetchLoginUser(
  email: string,
  password: string,
  abortControllerRef?: React.RefObject<AbortController | null>,
): Promise<User | ErrorData | null> {
  const url: string = process.env.LOGIN_URL || "";

  const requestBody = {
    email: email,
    password: password,
  };

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "POST",
    ...(abortControllerRef && { abortControllerRef }),
    bodyData: requestBody,
  };

  try {
    const response = await apiClient(apiClientParams);

    if (!response.ok) {
      const errorData: ErrorData = await response.json();

      throw errorData;
    }

    let [access_token, refresh_token] = response.headers.getSetCookie() || [];

    access_token = access_token.split(";")[0].split("=")[1];
    refresh_token = refresh_token.split(";")[0].split("=")[1];

    await setCookies(access_token, refresh_token);

    const data: User = await response.json();

    return data;
  } catch (error) {
    if (isErrorData(error)) {
      return error;
    }
    console.error(error);
    return null;
  }
}
