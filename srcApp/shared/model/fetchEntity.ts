"use server";

import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";

export async function fetchEntity<T>(
  url: string | URL,
  access_token: string,
  cacheTags?: string[],
  abortControllerRef?: React.RefObject<AbortController | null>,
): Promise<T | ErrorData | null> {
  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "GET",
    abortControllerRef,
    additionalHeaders: {
      authorization: `Bearer ${access_token}`,
    },
    ...(abortControllerRef && {
      abortControllerRef,
    }),
    ...(cacheTags && {
      cacheTags,
    }),
  };

  try {
    const response = await apiClient(apiClientParams);

    if (!response?.ok) {
      const errorData: ErrorData = await response.json();

      throw errorData;
    }

    const data: T = await response.json();

    return data;
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    console.error(error);
    return null;
  }
}
