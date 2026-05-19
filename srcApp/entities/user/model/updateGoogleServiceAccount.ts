import { type Dispatch, type SetStateAction } from "react";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

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
  const googleServiceAccountsData = {
    ...data,
    privateKey: formatKeyToEnvString(data.privateKey),
  };

  const updateData = {
    googleServiceAccounts: [
      { ...googleServiceAccountsData, updateMode: UpdateMode.UPDATE },
    ],
  };

  const result = await fetchWithAuth<
    User,
    {
      googleServiceAccounts: {
        updateMode: UpdateMode;
        privateKey: string;
        clientEmail: string;
        rootFolderId?: string;
      }[];
    }
  >(
    fetchUpdateGoogleServiceAccounts,
    updateData,
    `Google service account ${googleServiceAccountsData.clientEmail} updated successfully`,
    setLoading
  );

  setUser(result);
  setUpdateModalOpen(false);
  return result;
}
