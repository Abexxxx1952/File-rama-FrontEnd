import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types";
import { fetchStat } from "../api/fetchStat";
import { Stat } from "./types";

export async function getStat(router: AppRouterInstance): Promise<Stat | null> {
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: Stat | ErrorData = await fetchStat(access_token);

      if (isErrorData(data)) {
        notifyResponse(data, true);
        router.replace("/");
        return null;
      }

      return data;
    }
    if (!access_token && refresh_token) {
      return await refreshTokens(refresh_token, () => getStat(router));
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  }
}
