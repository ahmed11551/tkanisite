"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import type { Product } from "@/types/product";

interface PageProps {
  params: { slug: string };
  searchParams?: { page?: string };
}

export default function CatalogPage({ params, searchParams }: PageProps) {
  const { slug } = params;
  const pageNum = Number(searchParams?.page || 1);
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const categoryName = useMemo(() => (
    slug === "odezhda" ? "Ткани для одежды" : slug === "dom" ? "Ткани для дома" : "Каталог"
  ), [slug]);

  useEffect(() => {
    setItems([]);
    fetch(`/api/catalog/${slug}?page=${pageNum}&limit=${limit}`)
      .then((r) => r.json())
      .then((res: { items: Product[]; total: number }) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch(() => {
        setItems([]);
        setTotal(0);
      });
  }, [slug, pageNum]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="font-semibold tracking-[-0.8px] text-[#101010] text-[26px] sm:text-[32px] lg:text-[38px]">{categoryName}</h1>
        <p className="mt-2 text-gray-600">Найдено: {total}</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <select className="input-field w-full sm:w-auto" aria-label="Сортировка">
          <option>Сортировка по цене</option>
          <option>По возрастанию</option>
          <option>По убыванию</option>
          <option>Новинки</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.length === 0
          ? Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)
          : items.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-2">
          <a
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            href={`?page=${Math.max(1, pageNum - 1)}`}
          >
            Назад
          </a>
          <span className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white">
            {pageNum}/{totalPages}
          </span>
          <a
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            href={`?page=${Math.min(totalPages, pageNum + 1)}`}
          >
            Далее
          </a>
        </div>
      </div>
    </div>
  );
}

