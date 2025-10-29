import { NextResponse } from "next/server";
import data from "@/data/products.json";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);
  const list = (data as any).works || [];
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = list.slice(start, end);
  return NextResponse.json({ items, page, limit, total: list.length });
}


