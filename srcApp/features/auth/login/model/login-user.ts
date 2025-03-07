"use server";

import { revalidateTag } from "next/cache";
import { User } from "@/srcApp/entities/user/model/types/user";
import { setCookies } from "@/srcApp/features/cookies/model/setCookies";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types";

export async function loginUser(
  email: string,
  password: string,
  abortControllerRef: React.RefObject<AbortController | null>,
): Promise<User | ErrorData | undefined> {
  const url: string = process.env.LOGIN_URL || "";
  console.log(url);

  const requestBody = {
    email: email,
    password: password,
  };

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "POST",
    abortControllerRef,
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
    revalidateTag(CACHE_TAG.USER_BY_COOKIES);

    const data: User = await response.json();

    return data;
  } catch (error) {
    if (isErrorData(error)) {
      return error;
    } else {
      console.log("error", error);
    }
  }
}
