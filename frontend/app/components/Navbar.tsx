"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface FavoriteSummary {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string | null;
}

interface CartItem {
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setCartCount(0);
        return;
      }

      try {
        const userData = JSON.parse(savedUser);
        const key = `cart:${userData.id ?? userData.email ?? userData.username ?? "guest"}`;
        const savedCart = localStorage.getItem(key);

        if (savedCart) {
          const cart: CartItem[] = JSON.parse(savedCart);
          const count = cart.reduce((total, item) => total + item.quantity, 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };

    const updateUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    const updateFavorites = () => {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setFavoriteCount(0);
        return;
      }

      try {
        const userData = JSON.parse(savedUser);
        const key = `favorites:${userData.id ?? userData.email ?? userData.username ?? "guest"}`;
        const savedFavorites = localStorage.getItem(key);

        if (!savedFavorites) {
          setFavoriteCount(0);
          return;
        }

        const favorites: FavoriteSummary[] = JSON.parse(savedFavorites);
        setFavoriteCount(Array.isArray(favorites) ? favorites.length : 0);
      } catch {
        setFavoriteCount(0);
      }
    };

    updateCartCount();
    updateUser();
    updateFavorites();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("storage", updateUser);
    window.addEventListener("storage", updateFavorites);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("storage", updateFavorites);
    };
  }, []);

  const handleLogout = () => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        const userKey = userData.id ?? userData.email ?? userData.username ?? "guest";
        localStorage.removeItem(`cart:${userKey}`);
        localStorage.removeItem(`favorites:${userKey}`);
      } catch {
        localStorage.removeItem("cart");
        localStorage.removeItem("favorites");
      }
    }

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setUser(null);
    setProfileOpen(false);

    window.location.href = "/";
  };

  return (
    <nav
      style={{
        width: "100%",
        minHeight: "68px",
        background: "rgba(17, 24, 39, 0.97)",
        color: "white",
        padding: "14px 20px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        boxSizing: "border-box",
        display: "block",
        visibility: "visible",
        opacity: 1,
        overflow: "visible",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          minHeight: "40px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "25px",
          boxSizing: "border-box",
        }}
      >
        {/* Logo */}

        <Link
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              minWidth: "38px",
              borderRadius: "10px",
              background:
                "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "19px",
              fontWeight: "800",
              boxShadow:
                "0 4px 12px rgba(79,70,229,0.35)",
            }}
          >
            G
          </div>

          <div>
            <div
              style={{
                fontSize: "21px",
                fontWeight: "800",
                letterSpacing: "-0.5px",
                lineHeight: "1",
                color: "white",
              }}
            >
              Gadget
              <span
                style={{
                  color: "#818cf8",
                }}
              >
                Nest
              </span>
            </div>

            <div
              style={{
                fontSize: "9px",
                color: "#9ca3af",
                letterSpacing: "1.5px",
                marginTop: "4px",
                textTransform: "uppercase",
              }}
            >
              Smart Shopping
            </div>
          </div>
        </Link>

        {/* Navigation */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {/* Home */}

          <Link
            href="/"
            style={{
              color: "#e5e7eb",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              padding: "9px 12px",
              borderRadius: "8px",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "transparent";
            }}
          >
            Home
          </Link>

          {/* Products */}

          <Link
            href="/products"
            style={{
              color: "#e5e7eb",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              padding: "9px 12px",
              borderRadius: "8px",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "transparent";
            }}
          >
            Products
          </Link>

          {/* Favorites */}

          <Link
            href="/favorites"
            style={{
              color: "#e5e7eb",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              padding: "9px 12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "transparent";
            }}
          >
            <span
              style={{
                fontSize: "16px",
              }}
            >
              ♡
            </span>

            <span>Favorites</span>

            {favoriteCount > 0 && (
              <span
                style={{
                  minWidth: "20px",
                  height: "20px",
                  padding: "0 6px",
                  background: "#f59e0b",
                  color: "white",
                  borderRadius: "999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "800",
                  boxShadow:
                    "0 2px 6px rgba(245,158,11,0.35)",
                }}
              >
                {favoriteCount}
              </span>
            )}
          </Link>

          {/* Cart */}

          <Link
            href="/cart"
            style={{
              color: "#e5e7eb",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              padding: "9px 12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "transparent";
            }}
          >
            <span
              style={{
                fontSize: "16px",
              }}
            >
              🛒
            </span>

            <span>Cart</span>

            {cartCount > 0 && (
              <span
                style={{
                  minWidth: "20px",
                  height: "20px",
                  padding: "0 6px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "800",
                  boxShadow:
                    "0 2px 6px rgba(239,68,68,0.35)",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Divider */}

          <div
            style={{
              width: "1px",
              height: "28px",
              background: "rgba(255,255,255,0.12)",
              margin: "0 6px",
            }}
          />

          {/* Logged In */}

          {user ? (
            <div
              style={{
                position: "relative",
              }}
            >
              {/* Profile Button */}

              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "6px 10px",
                  borderRadius: "9px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!profileOpen) {
                    e.currentTarget.style.background =
                      "transparent";
                  }
                }}
              >
                {/* Avatar */}

                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "800",
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      lineHeight: "1.2",
                    }}
                  >
                    Welcome
                  </span>

                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#f9fafb",
                      lineHeight: "1.2",
                    }}
                  >
                    {user.username}
                  </span>
                </div>

                {/* Arrow */}

                <span
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                    marginLeft: "2px",
                  }}
                >
                  {profileOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Profile Dropdown */}

              {profileOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: "0",
                    width: "190px",
                    background: "#ffffff",
                    borderRadius: "12px",
                    boxShadow:
                      "0 15px 35px rgba(0,0,0,0.25)",
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    zIndex: 2000,
                  }}
                >
                  {/* My Profile */}

                  <Link
                    href="/account"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 15px",
                      color: "#111827",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "white";
                    }}
                  >
                    <span>👤</span>
                    <span>My Profile</span>
                  </Link>

                  {/* My Orders */}

                  <Link
                    href="/orders"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 15px",
                      color: "#111827",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "white";
                    }}
                  >
                    <span>📦</span>
                    <span>My Orders</span>
                  </Link>

                  {/* Separator */}

                  <div
                    style={{
                      height: "1px",
                      background: "#e5e7eb",
                    }}
                  />

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      border: "none",
                      background: "white",
                      color: "#dc2626",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 15px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "#fef2f2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "white";
                    }}
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Login */}

              <Link
                href="/login"
                style={{
                  color: "#e5e7eb",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "9px 14px",
                  borderRadius: "8px",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "transparent";
                }}
              >
                Login
              </Link>

              {/* Register */}

              <Link
                href="/register"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "700",
                  padding: "9px 16px",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #4f46e5, #6366f1)",
                  boxShadow:
                    "0 4px 12px rgba(79,70,229,0.25)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}