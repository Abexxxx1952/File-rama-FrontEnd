"use server";

import { revalidateTag } from "next/cache";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient, type apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { type ErrorData } from "@/srcApp/shared/model/types/errorData";

import { type FileSystemItemChangeResult } from "../model/types/FileSystemItemChangeResult";

export async function fetchDeleteFolder(
  access_token: string,
  {
    id,
    fileSystemItemsCurrentTag,
    abortControllerRef,
  }: {
    id: string;
    fileSystemItemsCurrentTag: string;
    abortControllerRef?: React.RefObject<AbortController | null>;
  }
): Promise<FileSystemItemChangeResult[] | ErrorData | null> {
  const url: string = `${process.env.DELETE_FOLDER_URL}/${id}`;

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "DELETE",
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
    revalidateTag(fileSystemItemsCurrentTag);
    revalidateTag(CACHE_TAG.STAT);
    const data: FileSystemItemChangeResult[] = await response.json();

    return data;
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    console.error(error);
    return null;
  }
}
