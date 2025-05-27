import { Dispatch, SetStateAction } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { fetchDeleteUser } from "../api/fetchDeleteUser";
import { User } from "./types/user";

export async function deleteUser(
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
): Promise<void> {
  setLoading(true);

  try {
    const { access_token, refresh_token } = await getCookies();
    if (access_token) {
      const data: User | ErrorData | null = await fetchDeleteUser(access_token);

      if (isErrorData(data)) {
        notifyResponse({
          isError: true,
          responseResult: data,
        });
      }

      notifyResponse({
        isError: false,
        successMessage: `User deleted successfully`,
      });

      router.replace("/");
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return deleteUser(setLoading, router);
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    setLoading(false);
  }
}
