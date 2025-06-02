import { useEffect, useState } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { FileUploadEvent } from "../types/fileUploadEvent";
import { StatusUpload } from "../types/fileUploadResult";

export function useUploadProgress(
  fileUploadId: string,

  onProgress: (data: FileUploadEvent) => void,
  onComplete?: (data: FileUploadEvent) => void,
  onError?: (err: any) => void,
): void {
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let eventSource: EventSource;

    const init = async () => {
      try {
        let { access_token, refresh_token } = await getCookies();

        if (!access_token && refresh_token) {
          try {
            await refreshTokens(refresh_token);
            setAttempt((prev) => prev + 1);
            return;
          } catch (err) {
            console.error("Token refresh failed", err);
            onError?.(err);
            return;
          }
        }

        if (!access_token) {
          console.warn("No access token available");
          return;
        }

        const url =
          `${process.env.NEXT_PUBLIC_CREATE_FILE_STATUS_URL}` + fileUploadId;

        eventSource = new EventSource(url, {
          withCredentials: true,
        });

        eventSource.onmessage = (event) => {
          try {
            const data: FileUploadEvent = JSON.parse(event.data);

            if (data.status === StatusUpload.UPLOADING) {
              onProgress(data);
            }

            if (data.status === StatusUpload.COMPLETED) {
              onComplete?.(data);
              eventSource.close();
            }

            if (data.status === StatusUpload.FAILED) {
              onError?.(data);
              eventSource.close();
            }
          } catch (err) {
            console.error("Failed to parse SSE event", err);
          }
        };

        eventSource.onerror = (err) => {
          if (eventSource.readyState == 2) return;

          console.error("SSE connection error", err);
          onError?.(err);
          eventSource?.close();
        };
      } catch (err) {
        console.error("getCookies Error", err);
        onError?.(err);
      }
    };

    init();

    return () => {
      if (eventSource?.readyState !== EventSource.CLOSED) {
        eventSource?.close();
      }
    };
  }, [attempt, onProgress, onError, onComplete]);
}
