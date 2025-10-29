import { NextResponse } from "next/server";
import data from "@/data/products.json";

function flattenAllProducts() {
  const d: any = data;
  const groups = [d.new, d.sale, d.combinations, ...(d.catalog ? Object.values(d.catalog) : [])] as any[];
  return groups.flat();
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const all = flattenAllProducts();
  const product = all.find((p: any) => String(p.id) === params.id);
  if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
  // enrich with defaults
  const enriched = {
    images: product.images || [product.image].filter(Boolean),
    description:
      product.description ||
      "Качественная ткань, подходит для пошива одежды и домашнего текстиля. Состав и параметры уточняйте у менеджера.",
    characteristics: product.characteristics || {
      Состав: "Хлопок/Лён/Вискоза",
      Ширина: "150 см",
      Плотность: "140–200 г/м²",
    },
    minQuantity: product.minQuantity || 0.5,
    step: product.step || 0.1,
    inStock: product.inStock ?? true,
    ...product,
  };
  return NextResponse.json(enriched);
}


