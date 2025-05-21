import { Dispatch, SetStateAction } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types";
import { fetchUpdateUser } from "../api/fetchUpdateUser";
import { GoogleServiceAccountsRequest, UpdateMode, User } from "./types/user";

export async function updateGoogleServiceAccount(
  googleServiceAccountsData: GoogleServiceAccountsRequest,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setUser: Dispatch<SetStateAction<User | null | undefined>>,
): Promise<User | null> {
  setLoading(true);

  const updateData = {
    googleServiceAccounts: [
      { ...googleServiceAccountsData, updateMode: UpdateMode.UPDATE },
    ],
  };

  try {
    const { access_token, refresh_token } = await getCookies();
    if (access_token) {
      const data: User | ErrorData = await fetchUpdateUser(
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
        `Google service account ${googleServiceAccountsData.clientEmail} updated successfully`,
      );
      setUser(data);
      return data;
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);

      return updateGoogleServiceAccount(
        googleServiceAccountsData,
        setLoading,
        setUser,
      );
    }
    return null;
  } catch (error) {
    console.log("error", error);
    return null;
  } finally {
    setLoading(false);
  }
}
