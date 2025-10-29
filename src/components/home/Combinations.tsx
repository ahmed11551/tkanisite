"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types/product";
import ProductSkeleton from "@/components/products/ProductSkeleton";

export default function Combinations() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products/combinations?page=1&limit=4")
      .then((r) => r.json())
      .then((res: { items: Product[] }) => setProducts(res.items))
      .catch(() => setProducts([]));
  }, []);
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container-custom">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-semibold tracking-[-0.8px] text-[#101010] text-[26px] sm:text-[32px] lg:text-[38px]">Комбинации</h2>
          <Link
            href="/collections/combinations"
            className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Посмотреть все
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.length === 0
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}

