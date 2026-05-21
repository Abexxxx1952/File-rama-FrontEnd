"use server";

import { revalidateTag } from "next/cache";

import { apiClient, type apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { type ErrorData } from "@/srcApp/shared/model/types/errorData";

export async function fetchGetFolderPath(
  access_token: string,
  {
    folderID,
    folderPathTag,
    abortControllerRef,
  }: {
    folderID: string;
    folderPathTag: string;
    abortControllerRef?: React.RefObject<AbortController | null>;
  }
): Promise<string | ErrorData | null> {
  const url: string = `${process.env.GET_FOLDER_PATH_URL}/${folderID}`;

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "GET",
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
    revalidateTag(folderPathTag);

    const data: string = await response.text();

    return data;
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    console.error(error);
    return null;
  }
}
