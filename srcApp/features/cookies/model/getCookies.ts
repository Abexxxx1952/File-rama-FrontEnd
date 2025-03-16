"use server";

import { cookies } from "next/headers";
import { COOKIES_NAME } from "../constant/cookies-name";
import { JwtAuthTokenType } from "./types";

export async function getCookies(): Promise<JwtAuthTokenType> {
  const cookieStore = await cookies();

  const access_token = cookieStore.get(
    COOKIES_NAME.AUTHENTICATION_ACCESS_TOKEN,
  );
  const refresh_token = cookieStore.get(
    COOKIES_NAME.AUTHENTICATION_REFRESH_TOKEN,
  );

  return {
    access_token: access_token?.value,
    refresh_token: refresh_token?.value,
  };
}
