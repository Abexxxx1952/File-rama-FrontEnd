import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchUser } from "../api/fetchUser";
import { type User } from "./types/user";

export async function getUser(): Promise<User | null> {
  return await fetchWithAuth<User>(fetchUser, undefined, undefined, undefined);
}
