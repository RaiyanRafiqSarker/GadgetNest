import { getCurrentUser, getScopedStorageKey } from "@/lib/userStorage";

export interface FavoriteProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string | null;
  categoryName?: string;
  brandName?: string;
}

const FAVORITES_KEY = "favorites";

export function getStoredFavorites(): FavoriteProduct[] {
  if (typeof window === "undefined") {
    return [];
  }

  const user = getCurrentUser();
  if (!user) {
    return [];
  }

  try {
    const saved = localStorage.getItem(getScopedStorageKey(FAVORITES_KEY));

    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(productId: number): boolean {
  return getStoredFavorites().some((item) => item.id === productId);
}

export function toggleFavorite(product: FavoriteProduct): FavoriteProduct[] {
  const favorites = getStoredFavorites();
  const exists = favorites.some((item) => item.id === product.id);

  const nextFavorites = exists
    ? favorites.filter((item) => item.id !== product.id)
    : [...favorites, product];

  if (typeof window !== "undefined" && getCurrentUser()) {
    localStorage.setItem(getScopedStorageKey(FAVORITES_KEY), JSON.stringify(nextFavorites));
  }

  return nextFavorites;
}
