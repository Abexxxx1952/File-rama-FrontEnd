"use server";

import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { User } from "../model/types/user";
import { userUpdateRequest } from "../model/types/userUpdateRequest";

export async function fetchUpdateUser(
  access_token: string,
  updateData: userUpdateRequest,
): Promise<User | ErrorData> {
  const url: string = `${process.env.UPDATE_USER_URL}`;

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "PATCH",
    additionalHeaders: {
      Authorization: `Bearer ${access_token}`,
    },
    bodyData: updateData,
  };

  try {
    const response = await apiClient(apiClientParams);

    if (!response?.ok) {
      const errorData: ErrorData = await response.json();

      throw errorData;
    }
    revalidateTag(CACHE_TAG.USER);
    const data: User = await response.json();

    return data;
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    throw error;
  }
}
