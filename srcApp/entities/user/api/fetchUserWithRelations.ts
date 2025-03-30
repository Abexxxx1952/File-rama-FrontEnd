"use server";

import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types";
import { serverResponse } from "../model/types/serverResponse";
import { User, UserWithRelations } from "../model/types/user";

export async function fetchUserWithRelations(
  access_token: string,
  abortControllerRef: React.RefObject<AbortController | null>,
): Promise<User | ErrorData> {
  const url: string = `${process.env.GET_USER_WITH_RELATIONS_URL}?condition={"relations":["files", "folders", "stats"]}`;

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
    const response = await apiClient(apiClientParams);

    if (!response?.ok) {
      const errorData: ErrorData = await response.json();

      throw errorData;
    }

    let temp: serverResponse = await response.json();

    const data: UserWithRelations = {
      ...temp.users[0],
      files: temp.files,
      folders: temp.folders,
      stats: temp.stats,
    };
    return data;
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    throw error;
  }
}
