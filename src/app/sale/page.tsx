"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types/product";

export default function SalePage({ searchParams }: { searchParams?: { page?: string } }) {
  const pageNum = Number(searchParams?.page || 1);
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(() => {
    setItems([]);
    fetch(`/api/products/sale?page=${pageNum}&limit=${limit}`)
      .then((r) => r.json())
      .then((res: { items: Product[]; total: number }) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch(() => {
        setItems([]);
        setTotal(0);
      });
  }, [pageNum]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>
      </div>

      <div className="mb-12 text-center">
        <h1 className="mb-4 font-semibold tracking-[-0.8px] text-[#101010] text-[26px] sm:text-[32px] lg:text-[38px]">Скидки и акции</h1>
        <p className="mx-auto max-w-2xl text-gray-600">Товары со скидкой. Приобретите качественные ткани по выгодным ценам</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.length === 0
          ? Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)
          : items.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-2">
          <a className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" href={`?page=${Math.max(1, pageNum - 1)}`}>
            Назад
          </a>
          <span className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white">{pageNum}/{totalPages}</span>
          <a className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" href={`?page=${Math.min(totalPages, pageNum + 1)}`}>
            Далее
          </a>
        </div>
      </div>
    </div>
  );
}

