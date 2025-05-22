import { Dispatch, SetStateAction } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { fetchUpdateGoogleServiceAccounts } from "../api/fetchUpdateGoogleServiceAccounts";
import { UpdateMode, User } from "./types/user";

export async function deleteGoogleServiceAccount(
  clientEmail: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setUser: Dispatch<SetStateAction<User | null | undefined>>,
): Promise<User | null> {
  setLoading(true);

  const updateData = {
    googleServiceAccounts: [{ clientEmail, updateMode: UpdateMode.DELETE }],
  };

  try {
    const { access_token, refresh_token } = await getCookies();
    if (access_token) {
      const data: User | ErrorData = await fetchUpdateGoogleServiceAccounts(
        access_token,
        updateData,
      );

      if (isErrorData(data)) {
        notifyResponse(data, true);

        return null;
      }
      notifyResponse(
        data,
        false,
        `Google service account ${clientEmail} deleted successfully`,
      );
      setUser(data);
      return data;
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return deleteGoogleServiceAccount(clientEmail, setLoading, setUser);
    }
    return null;
  } catch (error) {
    console.log("error", error);
    return null;
  } finally {
    setLoading(false);
  }
}
