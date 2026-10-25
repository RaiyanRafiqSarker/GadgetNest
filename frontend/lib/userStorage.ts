export interface StoredUser {
  id?: number | string;
  email?: string;
  username?: string;
}

export function getCurrentUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    const parsedUser = JSON.parse(savedUser);
    return parsedUser && typeof parsedUser === "object" ? parsedUser : null;
  } catch {
    return null;
  }
}

export function getScopedStorageKey(baseKey: string): string {
  const user = getCurrentUser();

  if (!user) {
    return `${baseKey}:guest`;
  }

  const userKey = user.id ?? user.email ?? user.username ?? "guest";
  return `${baseKey}:${String(userKey)}`;
}

export function getStoredCart(): Array<{[key: string]: any}> {
  if (typeof window === "undefined") {
    return [];
  }

  const user = getCurrentUser();
  if (!user) {
    return [];
  }

  try {
    const savedCart = localStorage.getItem(getScopedStorageKey("cart"));
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

export function setStoredCart(items: Array<{[key: string]: any}>): void {
  if (typeof window === "undefined") {
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    return;
  }

  localStorage.setItem(getScopedStorageKey("cart"), JSON.stringify(items));
}

export function clearCurrentUserStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");
    return;
  }

  const userCartKey = getScopedStorageKey("cart");
  const userFavoritesKey = getScopedStorageKey("favorites");

  localStorage.removeItem(userCartKey);
  localStorage.removeItem(userFavoritesKey);
  localStorage.removeItem("cart");
  localStorage.removeItem("favorites");
}
