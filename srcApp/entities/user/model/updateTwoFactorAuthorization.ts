import { type Dispatch, type SetStateAction } from "react";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchUpdateUser } from "../api/fetchUpdateUser";
import { type User } from "./types/user";

export async function updateTwoFactorAuthorization(
  isTwoFactorEnabled: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setUser: Dispatch<SetStateAction<User | null>>
): Promise<User | null> {
  const updateData = {
    isTwoFactorEnabled,
  };

  const result = await fetchWithAuth<
    User,
    {
      isTwoFactorEnabled: boolean;
    }
  >(
    fetchUpdateUser,
    updateData,
    `Two Factor Authorization is ${isTwoFactorEnabled ? "Enable" : "Disable"}`,
    setLoading
  );

  setUser(result);
  return result;
}
