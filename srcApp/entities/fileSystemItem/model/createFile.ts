"use client";

import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { revalidateFromClientByTag } from "@/srcApp/shared/model/revalidateFromClientByTag";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { FileUploadResult, StatusUpload } from "./types/fileUploadResult";

export async function createFile(
  params: FormData,
  fileUploadId: string,
  isRevalidateCacheRef: React.MutableRefObject<boolean>,
  abortControllerRef?: React.RefObject<AbortController | null>,
): Promise<FileUploadResult | null> {
  let signal: AbortSignal | undefined;
  if (abortControllerRef) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    signal = abortControllerRef.current.signal;
  }

  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const url: string =
        `${process.env.NEXT_PUBLIC_CREATE_FILE_URL}` + fileUploadId;
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

        if (isErrorData(errorData)) {
          notifyResponse({
            isError: true,
            responseResult: errorData,
          });
        } else {
          notifyResponse({
            isError: true,
            responseResult: null,
          });
        }

        return null;
      }

      const parsedData: FileUploadResult[] = await response.json();

      const data = parsedData.map((item) => {
        if (item.status === StatusUpload.COMPLETED) {
          notifyResponse({
            isError: false,
            successMessage: `File ${item.file.fileName} added successfully`,
          });
        }
        return item;
      });

      if (!isRevalidateCacheRef.current) {
        await revalidateFromClientByTag([
          CACHE_TAG.FILE_SYSTEM_ITEM,
          CACHE_TAG.STAT,
        ]);
        isRevalidateCacheRef.current = true;
      }
      return data[0];
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return createFile(
        params,
        fileUploadId,
        isRevalidateCacheRef,
        abortControllerRef,
      );
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  }
}
