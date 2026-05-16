"use server";

import { revalidateTag } from "next/cache";

import { apiClient, type apiClientArgs } from "@/srcApp/shared/model/apiClient";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import type { ErrorData } from "@/srcApp/shared/model/types/errorData";

import type { FetchUpdateFolder } from "../model/types/fetchUpdateFolder";
import type { Folder } from "../model/types/folder";

export async function fetchUpdateFolder(
  access_token: string,
  {
    updateFolderData,
    fileSystemItemsCurrentTags,
    abortControllerRef,
  }: {
    updateFolderData: FetchUpdateFolder;
    fileSystemItemsCurrentTags: string[];
    abortControllerRef?: React.RefObject<AbortController | null>;
  }
): Promise<Folder | ErrorData | null> {
  const url: string = `${process.env.UPDATE_FOLDER_URL}`;

  const apiClientParams: apiClientArgs = {
    baseUrl: url,
    method: "PATCH",
    ...(abortControllerRef && { abortControllerRef }),
    additionalHeaders: {
      Authorization: `Bearer ${access_token}`,
    },
    bodyData: updateFolderData,
  };

  try {
    const response = await apiClient(apiClientParams);

    if (!response?.ok) {
      const errorData: ErrorData = await response.json();

      throw errorData;
    }

    fileSystemItemsCurrentTags.forEach((tag) => revalidateTag(tag));

    const data: Folder = await response.json();

    return data;
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    return null;
  }
}
