"use client";

import { Dispatch, SetStateAction } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";

export async function downloadFile(
  fileDownloadId: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  abortControllerRef?: React.RefObject<AbortController | null>,
): Promise<{ fileUrl: string; fileName: string } | null> {
  let signal: AbortSignal | undefined;
  if (abortControllerRef) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    signal = abortControllerRef.current.signal;
  }
  setLoading(true);

  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const url: string =
        `${process.env.NEXT_PUBLIC_DOWNLOAD_FILE_URL}` + fileDownloadId;

      const response = await fetch(url, {
        method: "GET",
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

      const disposition = response.headers.get("Content-Disposition");
      let fileName = "";

      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?(.*?)"?$/);
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1]);
        }
      }

      const blob = await response.blob();

      const fileUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      setLoading(false);
      return { fileUrl, fileName };
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return downloadFile(fileDownloadId, setLoading, abortControllerRef);
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  }
}
