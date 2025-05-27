"use server";

import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { FetchAddFolder } from "../model/types/fetchAddFolder";
import { Folder } from "../model/types/folder";

export async function fetchCreateFolder(
  access_token: string,
  addFolderData: FetchAddFolder,
  abortControllerRef?: React.RefObject<AbortController | null>,
): Promise<Folder | ErrorData | null> {
  const url: string = `${process.env.CREATE_FOLDER_URL}`;

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "POST",
    ...(abortControllerRef && { abortControllerRef }),
    additionalHeaders: {
      Authorization: `Bearer ${access_token}`,
    },
    bodyData: addFolderData,
  };

  try {
    const response = await apiClient(apiClientParams);

    if (!response?.ok) {
      const errorData: ErrorData = await response.json();

      throw errorData;
    }
    revalidateTag(CACHE_TAG.FILE_SYSTEM_ITEM);
    revalidateTag(CACHE_TAG.STAT);
    const data: Folder = await response.json();

    return data;
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    console.error(error);
    return null;
  }
}
