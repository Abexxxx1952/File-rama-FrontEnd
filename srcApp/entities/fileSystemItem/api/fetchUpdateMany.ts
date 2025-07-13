"use server";

import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import type { ErrorData } from "@/srcApp/shared/model/types/errorData";
import type { FileSystemItemChangeResult } from "../model/types/FileSystemItemChangeResult";
import type { FetchUpdateMany } from "../model/types/fetchUpdateMany";

export async function fetchUpdateMany(
  access_token: string,
  updateMany: FetchUpdateMany,
  abortControllerRef?: React.RefObject<AbortController | null>,
): Promise<FileSystemItemChangeResult[] | ErrorData | null> {
  const url: string = `${process.env.UPDATE_MANY_URL}`;

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "PATCH",
    ...(abortControllerRef && { abortControllerRef }),
    additionalHeaders: {
      Authorization: `Bearer ${access_token}`,
    },
    bodyData: { updateMany },
  };

  try {
    const response = await apiClient(apiClientParams);

    if (!response?.ok) {
      const errorData: ErrorData = await response.json();

      throw errorData;
    }
    revalidateTag(CACHE_TAG.FILE_SYSTEM_ITEM);
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
