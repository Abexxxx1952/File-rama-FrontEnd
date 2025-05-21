import { Dispatch, SetStateAction } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types";
import { User } from "../../../../entities/user/model/types/user";
import { fetchEmailConfirmation } from "../api/fetchEmailConfirmation";

export async function emailConfirmation(
  abortControllerRef: React.RefObject<AbortController | null>,
  setLoading: Dispatch<SetStateAction<boolean>>,
): Promise<User | null> {
  setLoading(true);
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: { message: string } | ErrorData =
        await fetchEmailConfirmation(access_token, abortControllerRef);

      if (isErrorData(data)) {
        notifyResponse(data, true);

        return null;
      }
      notifyResponse(data, false, (data as { message: string }).message);
      return data;
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return emailConfirmation(abortControllerRef, setLoading);
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  } finally {
    setLoading(false);
  }
}
