"use server";

import { ErrorData } from "@/srcApp/shared/model/types";
import { setCookies } from "../../../cookies/model/setCookies";
import { JwtAuthTokenType } from "../../../cookies/model/types";

export async function refreshTokens<T extends (...args: any) => any>(
  refresh_token: string,
  func: T,
): Promise<ReturnType<T>> {
  const response = await fetch(`${process.env.REFRESH_TOKENS_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refresh_token}`,
    },
  });

  if (!response.ok) {
    const errorData: ErrorData = await response.json();
    throw errorData;
  }
  const data: JwtAuthTokenType = await response.json();
  if (data.access_token && data.refresh_token) {
    await setCookies(data.access_token, data.refresh_token);
  }

  return await func();
}
