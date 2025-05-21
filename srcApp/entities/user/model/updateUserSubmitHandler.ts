import { Dispatch, SetStateAction } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types";
import { fetchUpdateUser } from "../api/fetchUpdateUser";
import { User } from "./types/user";
import { UserUpdateFormData } from "./types/userUpdateFormData";

export async function updateUserSubmitHandler(
  data: UserUpdateFormData,
  setLoading: Dispatch<SetStateAction<boolean>>,

  setUser: Dispatch<SetStateAction<User | null | undefined>>,
): Promise<User | null> {
  setLoading(true);
  const updateData = {
    ...(data.name && {
      name: data.name,
    }),
    ...(data.password && {
      password: data.password,
    }),
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
      notifyResponse(data, false, "User updated successfully");
      setUser(data);
      return data;
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return updateUserSubmitHandler(data, setLoading, setUser);
    }
    return null;
  } catch (error) {
    console.log("error", error);
    return null;
  } finally {
    setLoading(false);
  }
}
