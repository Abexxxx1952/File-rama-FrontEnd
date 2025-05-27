"use server";

import { setCookies } from "@/srcApp/features/cookies/model/setCookies";
import { JwtAuthTokenType } from "@/srcApp/features/cookies/model/types/jwtToken";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";

export async function refreshTokens(refresh_token: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.REFRESH_TOKENS_URL}`, {
      method: "POST",
      headers: {
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
  } catch (error: unknown) {
    console.error(error);
  }
}
