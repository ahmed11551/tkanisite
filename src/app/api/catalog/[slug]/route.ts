import { NextResponse } from "next/server";
import data from "@/data/products.json";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);
  const list = (data as any).catalog?.[slug];
  if (!list) return NextResponse.json({ items: [], page, limit, total: 0 }, { status: 200 });
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = list.slice(start, end);
  return NextResponse.json({ items, page, limit, total: list.length });
}


