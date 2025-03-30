import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { fetchUserWithRelations } from "../api/fetchUserWithRelations";
import { User } from "./types/user";

export async function userInitialization(
  setUser: Dispatch<SetStateAction<User | null>>,
  abortControllerRef: React.RefObject<AbortController | null>,
): Promise<User | null> {
  const router = useRouter();
  try {
    const { access_token, refresh_token } = await getCookies();
    if (access_token) {
      const user = await fetchUserWithRelations(
        access_token,
        abortControllerRef,
      );
      if (!isErrorData(user)) {
        setUser(user);
        return user;
      }
      notifyResponse(user, true);
      router.replace("/");
      return null;
    }
    if (!access_token && refresh_token) {
      return await refreshTokens(refresh_token, userInitialization);
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  }
}
