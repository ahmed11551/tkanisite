"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface WorkItem { id: string; title: string; image: string }

function WorkCard({ work }: { work: WorkItem }) {
  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-square bg-gray-100">
        <Image src={work.image} alt={work.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900">{work.title}</h3>
      </div>
    </div>
  );
}

function WorkSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="aspect-square bg-gray-100 animate-pulse" />
      <div className="p-4">
        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function WorksPage({ searchParams }: { searchParams?: { page?: string } }) {
  const pageNum = Number(searchParams?.page || 1);
  const [items, setItems] = useState<WorkItem[]>([]);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(() => {
    setItems([]);
    fetch(`/api/works?page=${pageNum}&limit=${limit}`)
      .then((r) => r.json())
      .then((res: { items: WorkItem[]; total: number }) => {
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
        <h1 className="font-semibold tracking-[-0.8px] text-[#101010] text-[26px] sm:text-[32px] lg:text-[38px]">Работы из наших тканей</h1>
        <p className="mt-2 text-gray-600">Реальные изделия наших клиентов</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.length === 0
          ? Array.from({ length: 12 }).map((_, i) => <WorkSkeleton key={i} />)
          : items.map((w) => <WorkCard key={w.id} work={w} />)}
      </div>

      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-2">
          <Link className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" href={`?page=${Math.max(1, pageNum - 1)}`}>
            Назад
          </Link>
          <span className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white">{pageNum}/{totalPages}</span>
          <Link className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" href={`?page=${Math.min(totalPages, pageNum + 1)}`}>
            Далее
          </Link>
        </div>
      </div>
    </div>
  );
}

 

