import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types";
import { fetchUser } from "../api/fetchUser";
import { User } from "./types/user";

export async function getUser(): Promise<User | null> {
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: User | ErrorData = await fetchUser(access_token);

      if (isErrorData(data)) {
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
