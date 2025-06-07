"use server";

import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient, apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { File } from "../model/types/file";

export async function fetchDeleteFile(
  access_token: string,
  id: string,
  abortControllerRef?: React.RefObject<AbortController | null>,
): Promise<File | ErrorData | null> {
  const url: string = `${process.env.DELETE_FILE_URL}`;

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "DELETE",
    ...(abortControllerRef && { abortControllerRef }),
    additionalHeaders: {
      Authorization: `Bearer ${access_token}`,
    },
    bodyData: { fileId: id },
  };

  try {
    const response = await apiClient(apiClientParams);

    if (!response?.ok) {
      const errorData: ErrorData = await response.json();

      throw errorData;
    }
    revalidateTag(CACHE_TAG.FILE_SYSTEM_ITEM);
    revalidateTag(CACHE_TAG.STAT);
    const data: File = await response.json();

    return data;
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    console.error(error);
    return null;
  }
}
