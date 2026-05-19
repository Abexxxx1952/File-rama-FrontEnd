import { type Dispatch, type SetStateAction } from "react";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchUpdateGoogleServiceAccounts } from "../api/fetchUpdateGoogleServiceAccounts";
import { UpdateMode, type User } from "./types/user";

export async function deleteGoogleServiceAccount(
  clientEmail: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setUser: Dispatch<SetStateAction<User | null>>
): Promise<User | null> {
  const updateData = {
    googleServiceAccounts: [{ clientEmail, updateMode: UpdateMode.DELETE }],
  };

  const result = await fetchWithAuth<
    User,
    {
      googleServiceAccounts: {
        clientEmail: string;
        updateMode: UpdateMode;
      }[];
    }
  >(
    fetchUpdateGoogleServiceAccounts,
    updateData,
    `Google service account ${clientEmail} deleted successfully`,
    setLoading
  );

  setUser(result);

  return result;
}
