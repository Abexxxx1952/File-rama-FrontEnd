import { type Dispatch, type SetStateAction } from "react";

import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { type ErrorData } from "@/srcApp/shared/model/types/errorData";

import { fetchUpdateGoogleServiceAccounts } from "../api/fetchUpdateGoogleServiceAccounts";
import { formatKeyToEnvString } from "./lib/formatKeyToEnvString";
import {
  type GoogleServiceAccountsRequest,
  UpdateMode,
  type User,
} from "./types/user";

export async function updateGoogleServiceAccount(
  data: GoogleServiceAccountsRequest,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setUser: Dispatch<SetStateAction<User | null>>,
  setUpdateModalOpen: Dispatch<SetStateAction<boolean>>
): Promise<User | null> {
  setLoading(true);

  const googleServiceAccountsData = {
    ...data,
    privateKey: formatKeyToEnvString(data.privateKey),
  };

  const updateData = {
    googleServiceAccounts: [
      { ...googleServiceAccountsData, updateMode: UpdateMode.UPDATE },
    ],
  };

  try {
    const { access_token, refresh_token } = await getCookies();
    if (access_token) {
      const data: User | ErrorData | null =
        await fetchUpdateGoogleServiceAccounts(access_token, updateData);

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

      notifyResponse({
        isError: false,
        successMessage: `Google service account ${googleServiceAccountsData.clientEmail} updated successfully`,
      });
      setUser(data);
      setUpdateModalOpen(false);
      return data;
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);

      return updateGoogleServiceAccount(
        googleServiceAccountsData,
        setLoading,
        setUser,
        setUpdateModalOpen
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
