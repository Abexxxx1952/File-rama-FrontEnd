import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { fetchStat } from "../api/fetchStat";
import { Stat } from "./types/stat";

export async function getStat(): Promise<Stat | null> {
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: Stat | ErrorData = await fetchStat(access_token);

      if (isErrorData(data)) {
        notifyResponse(data, true);

        return null;
      }

      return data;
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return getStat();
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  }
}
