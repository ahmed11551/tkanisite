"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart-store";
import { ShoppingCart } from "lucide-react";
import ProductRecommendations from "@/components/products/ProductRecommendations";
import type { Product } from "@/types/product";

interface PageProps { params: { id: string } }

export default function ProductDetailPage({ params }: PageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(0.5);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      quantity,
      minQuantity: product.minQuantity,
      step: product.step,
    });
  };

  const handleBuyOneClick = () => {
    // TODO: Implement one-click buy functionality
    console.log("Buy in one click");
  };

  const discount = product?.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((p) => {
        setProduct(p);
        setQuantity(p.minQuantity || 0.5);
      })
      .catch(() => setProduct(null));
  }, [params.id]);

  return (
    <div className="container-custom py-8 lg:py-12">
      {/* Product info */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            {product ? (
              <Image
                src={(product.images && product.images[selectedImage]) || product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-gray-200" />
            )}
            {discount > 0 && (
              <div className="absolute left-4 top-4 rounded-full bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white">
                -{discount}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {product?.images?.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 ${
                  selectedImage === index ? "border-primary-600" : "border-gray-200"
                }`}
                aria-label={`Просмотреть изображение ${index + 1}`}
              >
                <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product?.name || ""}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{product ? product.price.toLocaleString() : ""} ₽</span>
              {product?.oldPrice && (
                <span className="text-xl text-gray-500 line-through">{product.oldPrice.toLocaleString()} ₽</span>
              )}
            </div>
            {product?.inStock ? (
              <p className="mt-2 text-sm text-green-600">✓ В наличии</p>
            ) : (
              <p className="mt-2 text-sm text-red-600">✗ Нет в наличии</p>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Описание</h2>
            <p className="text-gray-700 whitespace-pre-line">{product?.description || ""}</p>
          </div>

          {/* Characteristics */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Характеристики</h2>
            <div className="space-y-2 border-t border-gray-200 pt-3">
              {Object.entries(product?.characteristics || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-600">{key}:</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Количество:</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => product && setQuantity(Math.max(product.minQuantity, quantity - product.step))}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (product && !isNaN(val) && val >= product.minQuantity) {
                    setQuantity(val);
                  }
                }}
                min={product?.minQuantity || 0.5}
                step={product?.step || 0.1}
                className="w-24 rounded-lg border border-gray-300 px-4 py-3 text-center text-sm"
              />
              <button
                onClick={() => product && setQuantity(quantity + product.step)}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                +
              </button>
              <span className="text-sm text-gray-600">м</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button onClick={handleAddToCart} className="btn-primary w-full flex items-center justify-center" disabled={!product}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Добавить в корзину
            </button>
            <button onClick={handleBuyOneClick} className="btn-secondary w-full">
              Купить в 1 клик
            </button>
          </div>

          {/* Additional service: Thread matching - визуальная опция */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Подобрать нитки в тон</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Наши специалисты помогут подобрать идеальные нитки к выбранной ткани
                </p>
              </div>
              <button className="ml-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                Выбрать
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {product && <ProductRecommendations productId={product.id} />}
    </div>
  );
}

