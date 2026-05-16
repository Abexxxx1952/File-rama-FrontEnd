import { NextResponse } from "next/server";

import { setCookies } from "@/srcApp/features/cookies/model/setCookies";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { access_token, refresh_token } = body;

    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { message: "Missing access_token or refresh_token" },
        { status: 400 }
      );
    }

    await setCookies(access_token, refresh_token);

    return NextResponse.json({ message: "Cookies set successfully" });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error setting cookies:", message);

    return NextResponse.json(
      { message: "Failed to set cookies" },
      { status: 500 }
    );
  }
}
