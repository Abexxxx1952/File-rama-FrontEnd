"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { JwtTokenData, JwtTokenType } from "./types";

export async function setCookies(
  access_token: string,
  refresh_token: string,
): Promise<void> {
  function getDataFromToken(
    token: string,
    data: JwtTokenData,
    flag: JwtTokenType,
  ): number {
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;

      if (decoded && decoded[data] == "exp") {
        return decoded[data] * 1000; // Convert seconds to milliseconds
      }
      return flag === "access_token"
        ? Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME)
        : Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return flag === "access_token"
        ? Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME)
        : Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME);
    }
  }

  try {
    const accessTokenExpiry = getDataFromToken(
      access_token,
      "exp",
      "access_token",
    );
    const refreshTokenExpiry = getDataFromToken(
      refresh_token,
      "exp",
      "refresh_token",
    );

    const cookieStore = await cookies();

    cookieStore.set({
      name: "Authentication_accessToken",
      value: access_token,
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: accessTokenExpiry,
    });

    cookieStore.set({
      name: "Authentication_refreshToken",
      value: refresh_token,
      httpOnly: true,
      sameSite: "strict",
      path: process.env.JWT_REFRESH_TOKEN_DOMAIN_PATH,
      expires: refreshTokenExpiry,
    });
  } catch (error) {
    throw error;
  }
}
