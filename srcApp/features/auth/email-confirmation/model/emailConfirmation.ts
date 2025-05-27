import { Dispatch, SetStateAction } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { User } from "../../../../entities/user/model/types/user";
import { fetchEmailConfirmation } from "../api/fetchEmailConfirmation";

export async function emailConfirmation(
  setLoading: Dispatch<SetStateAction<boolean>>,
  abortControllerRef?: React.RefObject<AbortController | null>,
): Promise<User | null> {
  setLoading(true);
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: { message: string } | ErrorData | null =
        await fetchEmailConfirmation(access_token, abortControllerRef);

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

      notifyResponse({
        isError: false,
        successMessage: (data as { message: string }).message,
      });
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return emailConfirmation(setLoading);
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  } finally {
    setLoading(false);
  }
}
