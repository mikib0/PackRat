import { getAllCategories } from "@/lib/categories";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const categories = await getAllCategories();
  return NextResponse.json({ categories });
}
