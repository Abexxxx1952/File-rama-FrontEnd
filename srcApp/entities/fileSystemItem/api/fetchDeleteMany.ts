"use server";

import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { FileSystemItemChangeResult } from "../model/types/FileSystemItemChangeResult";
import { FetchDeleteMany } from "../model/types/fetchDeleteMany";

export async function fetchDeleteMany(
  access_token: string,
  deleteMany: FetchDeleteMany,
  abortControllerRef?: React.RefObject<AbortController | null>,
): Promise<FileSystemItemChangeResult[] | ErrorData | null> {
  const url: string = `${process.env.DELETE_MANY_URL}`;

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "DELETE",
    ...(abortControllerRef && { abortControllerRef }),
    additionalHeaders: {
      Authorization: `Bearer ${access_token}`,
    },
    bodyData: { deleteMany },
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
