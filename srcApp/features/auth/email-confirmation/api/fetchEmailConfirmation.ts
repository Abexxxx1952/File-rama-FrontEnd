"use server";

import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { User } from "../../../../entities/user/model/types/user";

export async function fetchEmailConfirmation(
  access_token: string,
  abortControllerRef?: React.RefObject<AbortController | null>,
): Promise<User | ErrorData | null> {
  const url: string = `${process.env.EMAIL_CONFIRMATION_URL}`;

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "POST",
    ...(abortControllerRef && { abortControllerRef }),
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
