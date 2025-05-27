"use server";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { fetchEntity } from "@/srcApp/shared/model/fetchEntity";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { User } from "../model/types/user";

export async function fetchUser(
  access_token: string,
): Promise<User | ErrorData | null> {
  const url: string = `${process.env.GET_USER_URL}`;

  return fetchEntity<User>(url, access_token, [CACHE_TAG.USER]);
}
