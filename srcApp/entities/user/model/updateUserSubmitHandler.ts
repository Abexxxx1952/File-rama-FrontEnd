import { type Dispatch, type SetStateAction } from "react";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchUpdateUser } from "../api/fetchUpdateUser";
import { type User } from "./types/user";
import { type UserUpdateFormData } from "./types/userUpdateFormData";

export async function updateUserSubmitHandler(
  data: UserUpdateFormData,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setUser: Dispatch<SetStateAction<User | null>>
): Promise<User | null> {
  const updateData = {
    ...(data.name && {
      name: data.name,
    }),
    ...(data.password && {
      password: data.password,
    }),
  };

  const result = await fetchWithAuth<
    User,
    {
      password?: string | undefined;
      name?: string | undefined;
    }
  >(fetchUpdateUser, updateData, "User updated successfully", setLoading);

  setUser(result);
  return result;
}
