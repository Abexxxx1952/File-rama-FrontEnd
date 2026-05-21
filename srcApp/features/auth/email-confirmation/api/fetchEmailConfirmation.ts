"use server";

import { apiClient, type apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { type ErrorData } from "@/srcApp/shared/model/types/errorData";

export async function fetchEmailConfirmation(
  access_token: string,
  args?: {
    abortControllerRef?: React.RefObject<AbortController | null | undefined>;
  }
): Promise<{ message: string } | ErrorData | null> {
  const url: string = `${process.env.EMAIL_CONFIRMATION_URL}`;

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "POST",
    ...(args?.abortControllerRef && {
      abortControllerRef: args.abortControllerRef,
    }),
    additionalHeaders: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  try {
    const response = await apiClient(apiClientParams);

    if (!response?.ok) {
      const errorData: ErrorData = await response.json();

      throw errorData;
    }

    const data: { message: string } = await response.json();

    return data;
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    console.error(error);
    return null;
  }
}
