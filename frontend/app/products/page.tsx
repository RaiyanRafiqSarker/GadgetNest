"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProductImageUrl } from "@/lib/media";
import { toggleFavorite } from "@/lib/favorites";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
};

type Brand = {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
};

type Product = {
  id: number;
  category: Category | null;
  brand: Brand | null;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_percent?: number;
  discounted_price?: string;
  has_discount?: boolean;
  stock: number;
  views_count?: number;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type PriceRange = {
  label: string;
  min: number;
  max: number | null;
};

const priceRanges: PriceRange[] = [
  { label: "Under ৳10,000", min: 0, max: 10000 },
  { label: "৳10,000 - ৳50,000", min: 10000, max: 50000 },
  { label: "৳50,000 - ৳100,000", min: 50000, max: 100000 },
  { label: "Above ৳100,000", min: 100000, max: null },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const getDiscountedPrice = (product: Product) => {
    const originalPrice = Number(product.price || 0);
    const discountPercent = Number(product.discount_percent || 0);

    if (!discountPercent || discountPercent <= 0) {
      return originalPrice;
    }

    return originalPrice * (1 - discountPercent / 100);
  };

  const getFavoriteIds = () => {
    if (typeof window === "undefined") {
      return [] as number[];
    }

    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      return [] as number[];
    }

    try {
      const userData = JSON.parse(savedUser);
      const storageKey = `favorites:${userData.id ?? userData.email ?? userData.username ?? "guest"}`;
      const savedFavorites = JSON.parse(localStorage.getItem(storageKey) || "[]");

      return Array.isArray(savedFavorites)
        ? savedFavorites.map((item) => Number(item.id))
        : [];
    } catch {
      return [] as number[];
    }
  };

  const addToCart = (product: Product) => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setToast("Please log in to add products to your cart");
      return;
    }

    const userData = JSON.parse(savedUser);
    const storageKey = `cart:${userData.id ?? userData.email ?? userData.username ?? "guest"}`;
    const existingCart = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    ) as Array<{
      productId: number;
      productName: string;
      price: string;
      quantity: number;
      image: string | null;
      slug: string;
    }>;

    const existingItem = existingCart.find(
      (item) => item.productId === product.id
    );

    const discountedPrice = getDiscountedPrice(product).toString();

    const updatedCart = existingItem
      ? existingCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [
          ...existingCart,
          {
            productId: product.id,
            productName: product.name,
            price: discountedPrice,
            quantity: 1,
            image: product.image,
            slug: product.slug,
          },
        ];

    localStorage.setItem(storageKey, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
    setToast("Product has been added to the Cart");
  };

  const handleFavoriteToggle = (product: Product) => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setToast("Please log in to save favorites");
      return;
    }

    const userData = JSON.parse(savedUser);
    const storageKey = `favorites:${userData.id ?? userData.email ?? userData.username ?? "guest"}`;
    const isAdding = !favoriteIds.includes(product.id);
    const nextFavorites = toggleFavorite({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      categoryName: product.category?.name,
      brandName: product.brand?.name,
    });

    localStorage.setItem(storageKey, JSON.stringify(nextFavorites));
    setFavoriteIds(nextFavorites.map((item) => item.id));
    window.dispatchEvent(new Event("storage"));

    if (isAdding) {
      setToast("Product has been added to the Favorites");
    }
  };

  useEffect(() => {
    setFavoriteIds(getFavoriteIds());
  }, [products]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productsResponse, brandsResponse, categoriesResponse] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/products/"),
          fetch("http://127.0.0.1:8000/api/brands/"),
          fetch("http://127.0.0.1:8000/api/categories/"),
        ]);

        if (!productsResponse.ok) throw new Error("Failed to fetch products");
        if (!brandsResponse.ok) throw new Error("Failed to fetch brands");
        if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");

        const [productsData, brandsData, categoriesData] = await Promise.all([
          productsResponse.json(),
          brandsResponse.json(),
          categoriesResponse.json(),
        ]);

        setProducts(productsData);
        setAllBrands(brandsData);
        setAllCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const brands = useMemo(
    () => allBrands.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [allBrands]
  );

  const categories = useMemo(
    () => allCategories.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [allCategories]
  );

  const toggleBrand = (brandName: string) => {
    setSelectedBrands((current) =>
      current.includes(brandName)
        ? current.filter((brand) => brand !== brandName)
        : [...current, brandName]
    );
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((current) =>
      current.includes(categoryName)
        ? current.filter((category) => category !== categoryName)
        : [...current, categoryName]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedPriceRange("");
  };

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchText ||
        product.name.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText) ||
        product.category?.name.toLowerCase().includes(searchText) ||
        product.brand?.name.toLowerCase().includes(searchText);

      const matchesBrand =
        selectedBrands.length === 0 ||
        (product.brand && selectedBrands.includes(product.brand.name));

      const matchesCategory =
        selectedCategories.length === 0 ||
        (product.category && selectedCategories.includes(product.category.name));

      let matchesPrice = true;

      if (selectedPriceRange) {
        const range = priceRanges.find((item) => item.label === selectedPriceRange);

        if (range) {
          const productPrice = Number(product.price);
          matchesPrice =
            productPrice >= range.min &&
            (range.max === null || productPrice < range.max);
        }
      }

      return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
    });
  }, [products, search, selectedBrands, selectedCategories, selectedPriceRange]);

  const searchSuggestions = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return [];

    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchText) ||
          product.description.toLowerCase().includes(searchText) ||
          product.category?.name.toLowerCase().includes(searchText) ||
          product.brand?.name.toLowerCase().includes(searchText)
      )
      .slice(0, 8);
  }, [products, search]);

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedCategories.length > 0 ||
    selectedPriceRange !== "";

  return (
    <main className="min-h-screen bg-gray-50">
      {toast && (
        <div className="fixed right-5 top-5 z-[9999] rounded-lg bg-green-500 px-4 py-3 text-sm font-medium text-black shadow-xl">
          {toast}
        </div>
      )}

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-3xl">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => setSearchFocused(false), 150);
                }}
                placeholder="Search products..."
                className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 pr-12 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>

            {searchFocused && search.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                        {product.image ? (
                          <img
                            src={getProductImageUrl(product.image) || ""}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.brand?.name || "No Brand"}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-gray-900">
                        ৳{Number(product.price).toLocaleString()}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="px-5 py-4 text-sm text-gray-500">
                    No products found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium text-gray-600 hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
                Brand
              </h3>
              <div className="space-y-3">
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.name)}
                        onChange={() => toggleBrand(brand.name)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span>{brand.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No brands available.</p>
                )}
              </div>
            </div>

            <div className="border-b border-gray-200 py-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
                Price Range
              </h3>
              <div className="space-y-3">
                {priceRanges.map((range) => (
                  <label
                    key={range.label}
                    className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
                  >
                    <input
                      type="radio"
                      name="price-range"
                      value={range.label}
                      checked={selectedPriceRange === range.label}
                      onChange={() => setSelectedPriceRange(range.label)}
                      className="h-4 w-4 border-gray-300"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
                Category
              </h3>
              <div className="space-y-3">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => toggleCategory(category.name)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span>{category.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No categories available.</p>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Clear All Filters
              </button>
            )}
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-gray-500">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center">
                <h2 className="text-lg font-semibold text-gray-900">No products found</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    clearFilters();
                  }}
                  className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block aspect-square overflow-hidden bg-gray-100"
                      >
                        {product.image ? (
                          <img
                            src={getProductImageUrl(product.image)}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                            No Image
                          </div>
                        )}
                      </Link>

                      <button
                        type="button"
                        aria-label={
                          favoriteIds.includes(product.id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleFavoriteToggle(product);
                        }}
                        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border text-lg shadow-md transition ${
                          favoriteIds.includes(product.id)
                            ? "border-red-200 bg-red-50 text-red-500"
                            : "border-gray-200 bg-white/90 text-gray-700 hover:text-red-500"
                        }`}
                      >
                        {favoriteIds.includes(product.id) ? "♥" : "♡"}
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          {product.category?.name || "Uncategorized"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.brand?.name || "No Brand"}
                        </span>
                      </div>

                      <Link href={`/products/${product.slug}`} className="block">
                        <h2 className="line-clamp-2 text-base font-semibold text-gray-900 transition hover:text-gray-700">
                          {product.name}
                        </h2>
                      </Link>

                      {product.discount_percent && product.discount_percent > 0 ? (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
                            {product.discount_percent}% OFF
                          </span>
                        </div>
                      ) : null}

                      <div className="mt-3 flex items-end gap-2">
                        <p className="text-lg font-bold text-gray-900">
                          ৳{getDiscountedPrice(product).toLocaleString()}
                        </p>
                        {product.discount_percent && product.discount_percent > 0 ? (
                          <p className="text-sm text-gray-400 line-through">
                            ৳{Number(product.price).toLocaleString()}
                          </p>
                        ) : null}
                      </div>

                      <p
                        className={`mt-2 text-xs font-medium ${
                          product.stock > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </p>

                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className={`mt-auto w-full rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                          product.stock > 0
                            ? "bg-gray-900 text-white hover:bg-gray-700"
                            : "cursor-not-allowed bg-gray-300 text-gray-500"
                        }`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
