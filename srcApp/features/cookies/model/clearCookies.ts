"use server";

import { cookies } from "next/headers";

export async function clearCookies(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "Authentication_accessToken",
      value: "",
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    });

    cookieStore.set({
      name: "Authentication_refreshToken",
      value: "",
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    });
  } catch (error) {
    console.error("Failed to clear cookies:", error);
    throw error;
  }
}
