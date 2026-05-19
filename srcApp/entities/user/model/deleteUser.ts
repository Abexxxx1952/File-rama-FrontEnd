import { type Dispatch, type SetStateAction } from "react";

import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchDeleteUser } from "../api/fetchDeleteUser";
import { type User } from "./types/user";

export async function deleteUser(
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance
): Promise<void> {
  const result = await fetchWithAuth<User>(
    fetchDeleteUser,
    undefined,
    "User deleted successfully",
    setLoading
  );

  if (result) {
    router.replace("/");
  }
}
