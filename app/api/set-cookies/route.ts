import { NextResponse } from "next/server";
import { setCookies } from "@/srcApp/features/cookies/model/setCookies";

export async function POST(req: Request) {
  try {
    const { access_token, refresh_token } = await req.json();

    await setCookies(access_token, refresh_token);

    return NextResponse.json({ message: "Cookies set successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
