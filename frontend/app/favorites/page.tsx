"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProductImageUrl } from "@/lib/media";
import { getStoredFavorites, toggleFavorite } from "@/lib/favorites";

interface FavoriteProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string | null;
  categoryName?: string;
  brandName?: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refreshFavorites = () => {
    const stored = getStoredFavorites();
    setFavorites(stored);
    setLoaded(true);
  };

  useEffect(() => {
    refreshFavorites();

    const handleStorage = () => refreshFavorites();
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const removeFavorite = (productId: number) => {
    const current = getStoredFavorites();
    const product = current.find((item) => item.id === productId);

    if (!product) return;

    const next = toggleFavorite(product);
    setFavorites(next);
    window.dispatchEvent(new Event("storage"));
  };

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-6xl text-gray-600">Loading favorites...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
              My Collection
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Favorites</h1>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-black"
          >
            Continue Shopping
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              ♡
            </div>
            <h2 className="text-xl font-semibold text-gray-900">No favorites yet</h2>
            <p className="mt-2 text-sm text-gray-500">
              Save products you love and they will appear here.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative">
                  <Link href={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-gray-100">
                    {product.image ? (
                      <img
                        src={getProductImageUrl(product.image) || ""}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        No Image
                      </div>
                    )}
                  </Link>

                  <button
                    type="button"
                    aria-label="Remove from favorites"
                    onClick={() => removeFavorite(product.id)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-lg text-red-500 shadow-md transition hover:bg-red-100"
                  >
                    ♥
                  </button>
                </div>

                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {product.categoryName || "Uncategorized"}
                    </span>

                    <span className="text-xs text-gray-500">
                      {product.brandName || "No Brand"}
                    </span>
                  </div>

                  <Link href={`/products/${product.slug}`} className="block">
                    <h2 className="line-clamp-2 text-base font-semibold text-gray-900 transition hover:text-gray-700">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="mt-4 text-lg font-bold text-gray-900">
                    ৳{Number(product.price || 0).toLocaleString()}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-700"
                    >
                      View Product
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFavorite(product.id)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-black"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
