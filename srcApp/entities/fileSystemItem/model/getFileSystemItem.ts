import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { fetchFileSystemItem } from "../api/fetchFileSystemItem";
import { FileSystemItem } from "./types/fileSystemItem";

export async function getFileSystemItems(
  parentFolderId?: string,
): Promise<FileSystemItem[] | null> {
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: FileSystemItem | ErrorData | null = await fetchFileSystemItem(
        access_token,
        parentFolderId,
      );

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
      return getFileSystemItems();
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  }
}
