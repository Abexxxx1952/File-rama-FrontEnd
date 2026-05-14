import { Dispatch, SetStateAction } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "./isErrorData";
import { notifyResponse } from "./notifyResponse";
import { ErrorData } from "./types/errorData";

export async function fetchWithAuth<ReturnData, Args extends object>(
  fn: (
    access_token: string,
    args: Args,
  ) => Promise<ReturnData | ErrorData | null>,
  args: Args,
  successMessage?: string | ((data: ReturnData) => string[] | string),
  setLoading?: Dispatch<SetStateAction<boolean>>,
): Promise<ReturnData | null> {
  if (setLoading) setLoading(true);

  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: ReturnData | ErrorData | null = await fn(access_token, args);

      if (isErrorData(data)) {
        notifyResponse({
          isError: true,
          responseResult: data,
        });
        return null;
      }

      if (data === null) {
        notifyResponse({
          isError: true,
          responseResult: null,
        });
        return null;
      }

      if (typeof successMessage === "function") {
        const message = successMessage(data);
        if (Array.isArray(message)) {
          message.forEach((msg) =>
            notifyResponse({
              isError: false,
              successMessage: msg,
            }),
          );
        } else {
          notifyResponse({
            isError: false,
            successMessage: message,
          });
        }
      }

      if (typeof successMessage === "string") {
        notifyResponse({
          isError: false,
          successMessage,
        });
      }

      if (setLoading) setLoading(false);
      return data;
    }

    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return fetchWithAuth<ReturnData, Args>(
        fn,
        args,
        successMessage,
        setLoading,
      );
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
}
