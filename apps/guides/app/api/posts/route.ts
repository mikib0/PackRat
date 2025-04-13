import { getAllPosts } from "@/lib/mdx-static";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json({ posts });
}
