"use server";

import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refresh-tokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types";
import { User } from "../model/types/user";

export async function fetchUserData(
  abortControllerRef: React.RefObject<AbortController | null>,
): Promise<User | ErrorData | null> {
  const { access_token, refresh_token } = await getCookies();
  if (!access_token && !refresh_token) {
    return null;
  }
  const url: string = process.env.GET_USER_DATA_PATH || "";

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "GET",
    abortControllerRef,
    additionalHeaders: {
      Authorization: `Bearer ${access_token}`,
    },
    revalidateTime: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME), // 15 minutes
  };

  try {
    if (access_token) {
      const response = await apiClient(apiClientParams);

      if (!response?.ok) {
        const errorData: ErrorData = await response.json();

        throw errorData;
      }

      const data: User = await response.json();

      return data;
    }

    if (!access_token && refresh_token) {
      return await refreshTokens(
        refresh_token,
        fetchUserData,
        abortControllerRef,
      );
    }
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    throw error;
  }

  return null;
}
