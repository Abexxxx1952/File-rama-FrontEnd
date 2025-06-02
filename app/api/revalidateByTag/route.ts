// app/api/revalidate/route.ts
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { tags }: { tags: string[] } = await request.json();

  if (!Array.isArray(tags) || tags.length === 0) {
    return NextResponse.json({ error: "No tags provided" }, { status: 400 });
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true, tags });
}
