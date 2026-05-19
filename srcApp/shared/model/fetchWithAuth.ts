import { type Dispatch, type SetStateAction } from "react";

import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";

import { isErrorData } from "./isErrorData";
import { notifyResponse } from "./notifyResponse";
import { type ErrorData } from "./types/errorData";

type FetchFnWithArgs<ReturnData, Args extends object> = (
  access_token: string,
  args: Args
) => Promise<ReturnData | ErrorData | null>;

type FetchFnWithoutArgs<ReturnData> = (
  access_token: string
) => Promise<ReturnData | ErrorData | null>;

export async function fetchWithAuth<ReturnData>(
  fn: FetchFnWithoutArgs<ReturnData>,
  args?: undefined,
  successMessage?: string | ((data: ReturnData) => string[] | string),
  setLoading?: Dispatch<SetStateAction<boolean>>
): Promise<ReturnData | null>;

export async function fetchWithAuth<ReturnData, Args extends object>(
  fn: FetchFnWithArgs<ReturnData, Args>,
  args: Args,
  successMessage?: string | ((data: ReturnData) => string[] | string),
  setLoading?: Dispatch<SetStateAction<boolean>>
): Promise<ReturnData | null>;

// implementation
export async function fetchWithAuth<ReturnData, Args extends object>(
  fn: FetchFnWithoutArgs<ReturnData> | FetchFnWithArgs<ReturnData, Args>,
  args?: Args,
  successMessage?: string | ((data: ReturnData) => string[] | string),
  setLoading?: Dispatch<SetStateAction<boolean>>
): Promise<ReturnData | null> {
  if (setLoading) {
    setLoading(true);
  }

  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data =
        args !== undefined
          ? await (fn as FetchFnWithArgs<ReturnData, Args>)(access_token, args)
          : await (fn as FetchFnWithoutArgs<ReturnData>)(access_token);

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
            })
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

      return data;
    }

    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);

      if (args !== undefined) {
        return fetchWithAuth(
          fn as FetchFnWithArgs<ReturnData, Args>,
          args,
          successMessage,
          setLoading
        );
      }

      return fetchWithAuth(
        fn as FetchFnWithoutArgs<ReturnData>,
        undefined,
        successMessage,
        setLoading
      );
    }

    return null;
  } catch (error) {
    console.warn("error", error);
    return null;
  } finally {
    setLoading?.(false);
  }
}
