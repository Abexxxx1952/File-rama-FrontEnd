"use client";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { revalidateFromClientByTag } from "@/srcApp/shared/model/revalidateFromClientByTag";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { FileUploadResult } from "../model/types/fileUploadResult";

export async function fetchCreateFile(
  access_token: string,
  {
    params,
    fileUploadId,
    fileSystemItemsCurrentTag,
    abortControllerRef,
  }: {
    params: FormData;
    fileUploadId: string;
    fileSystemItemsCurrentTag: string;
    abortControllerRef?: React.RefObject<AbortController | null>;
  },
): Promise<FileUploadResult | null | ErrorData> {
  let signal: AbortSignal | undefined;
  if (abortControllerRef?.current?.signal) {
    signal = abortControllerRef.current.signal;
  }

  const url: string =
    `${process.env.NEXT_PUBLIC_CREATE_FILE_URL}` + fileUploadId;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: params,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      ...(abortControllerRef && { signal }),
    });

    if (!response?.ok) {
      const errorData: ErrorData = await response.json();

      throw errorData;
    }

    await revalidateFromClientByTag([
      fileSystemItemsCurrentTag,
      CACHE_TAG.STAT,
    ]);

    const parsedData: FileUploadResult[] = await response.json();

    return parsedData[0];
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    console.error(error);
    return null;
  }
}
