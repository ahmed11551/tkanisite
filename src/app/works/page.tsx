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

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

// Mock data - will be replaced with API call
const works = [
  {
    id: "1",
    title: "Летнее платье из льна",
    image: "/images/placeholders/work-1.jpg",
    fabricName: "Лен премиум",
    fabricLink: "/catalog/fabric-1",
    description: "Легкое и удобное платье из натурального льна",
  },
  {
    id: "2",
    title: "Комплект постельного белья",
    image: "/images/placeholders/work-2.jpg",
    fabricName: "Сатин Турция",
    fabricLink: "/catalog/fabric-2",
    description: "Изготовлено из высококачественного сатина",
  },
  {
    id: "3",
    title: "Стильная блуза",
    image: "/images/placeholders/work-3.jpg",
    fabricName: "Шелк",
    fabricLink: "/catalog/fabric-3",
    description: "Элегантная блуза из натурального шелка",
  },
  {
    id: "4",
    title: "Шторы для спальни",
    image: "/images/placeholders/work-4.jpg",
    fabricName: "Ткань для дома",
    fabricLink: "/catalog/fabric-4",
    description: "Красивые и практичные шторы",
  },
  {
    id: "5",
    title: "Сумка из джинсы",
    image: "/images/placeholders/work-1.jpg",
    fabricName: "Джинса",
    fabricLink: "/catalog/fabric-5",
    description: "Прочная и стильная сумка",
  },
  {
    id: "6",
    title: "Комплект постельного белья",
    image: "/images/placeholders/work-2.jpg",
    fabricName: "Поплин Турция",
    fabricLink: "/catalog/fabric-6",
    description: "Мягкое и приятное постельное белье",
  },
];

export default function WorksPage() {
  return (
    <div className="container-custom py-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>
      </div>

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Работы из наших тканей
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Вдохновляйтесь идеями и создавайте уникальные вещи из качественных материалов
        </p>
      </div>

      {/* Works gallery */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg"
          >
            <Link href={work.fabricLink}>
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {work.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  {work.description}
                </p>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-sm font-medium text-gray-600">
                    Ткань:
                  </span>
                  <span className="text-sm font-semibold text-primary-600">
                    {work.fabricName}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

