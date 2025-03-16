"use server";

import { setCookies } from "@/srcApp/features/cookies/model/setCookies";
import { JwtAuthTokenType } from "@/srcApp/features/cookies/model/types";
import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types";

export async function refreshTokens<T extends (...args: any) => any>(
  refresh_token: string,
  func: T,
  abortControllerRef: React.RefObject<AbortController | null>,
): Promise<ReturnType<T> | ErrorData> {
  const url: string = process.env.GET_TOKENS_URL || "";

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "POST",
    abortControllerRef,
    additionalHeaders: {
      Authorization: `Bearer ${refresh_token}`,
    },
  };

  try {
    const response = await apiClient(apiClientParams);

    if (!response.ok) {
      const errorData: ErrorData = await response.json();
      throw errorData;
    }
    const data: JwtAuthTokenType = await response.json();
    if (data.access_token && data.refresh_token) {
      await setCookies(data.access_token, data.refresh_token);
    }

    return await func();
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    throw error;
  }
}
