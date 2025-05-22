import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { fetchFileSystemItem } from "../api/fetchFileSystemItem";
import { FileSystemItem } from "./types";

export async function getStat(
  router: AppRouterInstance,
): Promise<FileSystemItem | null> {
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: FileSystemItem | ErrorData =
        await fetchFileSystemItem(access_token);

      if (isErrorData(data)) {
        notifyResponse(data, true);
        router.replace("/");
        return null;
      }

      return data;
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return getStat(router);
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  }
}
