import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { fetchUser } from "../api/fetchUser";
import { User } from "./types/user";

export async function getUser(): Promise<User | null> {
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: User | ErrorData | null = await fetchUser(access_token);

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

      return data;
    }

    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return getUser();
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  }
}
