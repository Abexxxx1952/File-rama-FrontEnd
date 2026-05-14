"use client";

import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";

export async function fetchOpenFile(
  access_token: string,
  {
    fileDownloadId,
    abortControllerRef,
  }: {
    fileDownloadId: string;
    abortControllerRef?: React.RefObject<AbortController | null>;
  },
): Promise<{ fileUrl: string; fileName: string } | null | ErrorData> {
  let signal: AbortSignal | undefined;
  if (abortControllerRef?.current?.signal) {
    signal = abortControllerRef.current.signal;
  }

  const url: string =
    `${process.env.NEXT_PUBLIC_DOWNLOAD_FILE_URL}` + fileDownloadId;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      ...(abortControllerRef && { signal }),
    });

    if (!response?.ok) {
      const errorData: ErrorData = await response.json();

      throw errorData;
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

    window.open(fileUrl, "_blank");

    return { fileUrl, fileName };
  } catch (error: unknown) {
    if (isErrorData(error)) {
      return error;
    }
    console.error(error);
    return null;
  }
}
