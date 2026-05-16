"use server";

import { revalidateTag } from "next/cache";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient, type apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { type ErrorData } from "@/srcApp/shared/model/types/errorData";

import { type User } from "../model/types/user";
import { type userUpdateRequest } from "../model/types/userUpdateRequest";

export async function fetchUpdateGoogleServiceAccounts(
  access_token: string,
  updateData: userUpdateRequest
): Promise<User | ErrorData | null> {
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
    revalidateTag(CACHE_TAG.STAT);
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
