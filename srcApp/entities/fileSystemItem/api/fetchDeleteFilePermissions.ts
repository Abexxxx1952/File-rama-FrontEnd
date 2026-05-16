"use server";

import { revalidateTag } from "next/cache";

import { apiClient, type apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import type { ErrorData } from "@/srcApp/shared/model/types/errorData";

import type { File } from "../model/types/file";

export async function fetchDeleteFilePermissions(
  access_token: string,
  {
    fileId,
    fileSystemItemsCurrentTag,
    abortControllerRef,
  }: {
    fileId: string;
    fileSystemItemsCurrentTag: string;
    abortControllerRef?: React.RefObject<AbortController | null>;
  }
): Promise<File | ErrorData | null> {
  const url: string = `${process.env.DELETE_FILE_PERMISSIONS_URL}/${fileId}`;

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "PATCH",
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
